// Copies every table from Supabase (PostgreSQL) to Hostinger (MySQL/MariaDB).
// Optional: --images  downloads all Cloudinary images into ./storage-export
//                      and rewrites their links to /media/cloudinary/...
//
// Usage (PowerShell, inside the hostinger-move folder):
//   $env:PG_URL="postgresql://...supabase..."      (Supabase SESSION/direct connection string)
//   $env:MYSQL_URL="mysql://user:pass@host:3306/dbname"
//   node copy-data.mjs --images
//
// Safe to run again: it empties the MySQL tables first, then copies fresh.
import pg from "pg";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

const PG_URL = process.env.PG_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const DO_IMAGES = process.argv.includes("--images");
const EXPORT_DIR = path.resolve("storage-export");

if (!PG_URL || !MYSQL_URL) {
  console.error("Set PG_URL and MYSQL_URL first (see top of this file).");
  process.exit(1);
}

// Keep timestamps exactly as stored — no timezone shifting
pg.types.setTypeParser(1114, (s) => s); // timestamp
pg.types.setTypeParser(1184, (s) => new Date(s).toISOString().replace("T", " ").replace("Z", "")); // timestamptz -> UTC
pg.types.setTypeParser(1082, (s) => s); // date

const src = new pg.Client({ connectionString: PG_URL, ssl: { rejectUnauthorized: false } });
await src.connect();
const dst = await mysql.createConnection({ uri: MYSQL_URL, multipleStatements: false, dateStrings: true });

// ── Cloudinary image handling ───────────────────────────────────────────────
const CLD_RE = /https?:\/\/res\.cloudinary\.com\/[^/\s"'<>]+\/image\/upload\/([^\s"'<>?#)]+)/g;
const downloaded = new Map(); // url -> local link
let imgOk = 0, imgFail = 0;

async function fetchImage(url, relPath) {
  if (downloaded.has(url)) return downloaded.get(url);
  const safe = relPath.split("/").map((p) => p.replace(/[^a-zA-Z0-9._-]/g, "_")).join("/");
  const local = `/media/cloudinary/${safe}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const file = path.join(EXPORT_DIR, "cloudinary", ...safe.split("/"));
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, buf);
    imgOk++;
    downloaded.set(url, local);
    return local;
  } catch (e) {
    imgFail++;
    console.warn(`   ! could not download ${url} (${e.message}) — keeping original link`);
    downloaded.set(url, url);
    return url;
  }
}

async function rewriteString(s) {
  const matches = [...s.matchAll(CLD_RE)];
  if (!matches.length) return s;
  let out = s;
  for (const m of matches) out = out.split(m[0]).join(await fetchImage(m[0], m[1]));
  return out;
}

async function rewriteDeep(v) {
  if (typeof v === "string") return rewriteString(v);
  if (Array.isArray(v)) return Promise.all(v.map(rewriteDeep));
  if (v && typeof v === "object" && !(v instanceof Date) && !Buffer.isBuffer(v)) {
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = await rewriteDeep(x);
    return o;
  }
  return v;
}

// ── Copy tables ─────────────────────────────────────────────────────────────
const { rows: tables } = await src.query(
  `SELECT table_name FROM information_schema.tables
   WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name <> '_prisma_migrations'
   ORDER BY table_name`,
);

const [myTables] = await dst.query("SHOW TABLES");
// Windows MySQL stores table names in lowercase ("User" -> "user"), so match ignoring case
const myNames = new Map(myTables.map((r) => { const n = Object.values(r)[0]; return [n.toLowerCase(), n]; }));

await dst.query("SET FOREIGN_KEY_CHECKS=0");
const report = [];

for (const { table_name: pgName } of tables) {
  const t = myNames.get(pgName.toLowerCase());
  if (!t) {
    const t = pgName;
    console.log(`- skip ${t} (not in MySQL schema)`);
    report.push([t, "skipped", "", ""]);
    continue;
  }
  const [cols] = await dst.query(
    "SELECT COLUMN_NAME, DATA_TYPE FROM information_schema.columns WHERE table_schema = DATABASE() AND LOWER(table_name) = LOWER(?)",
    [t],
  );
  const myCols = new Map(cols.map((c) => [c.COLUMN_NAME, c.DATA_TYPE]));

  const { rows } = await src.query(`SELECT * FROM "${pgName}"`);
  const useCols = rows.length ? Object.keys(rows[0]).filter((c) => myCols.has(c)) : [];

  await dst.query("DELETE FROM ??", [t]);
  process.stdout.write(`- ${t}: ${rows.length} rows ... `);

  const values = [];
  for (const r of rows) {
    const line = [];
    for (const c of useCols) {
      let v = r[c];
      if (DO_IMAGES) v = await rewriteDeep(v);
      if (v !== null && typeof v === "object" && !Buffer.isBuffer(v)) v = JSON.stringify(v);
      if (typeof v === "boolean") v = v ? 1 : 0;
      line.push(v);
    }
    values.push(line);
  }

  let inserted = 0, failed = 0;
  for (let i = 0; i < values.length; i += 200) {
    const batch = values.slice(i, i + 200);
    try {
      await dst.query("INSERT INTO ?? (??) VALUES ?", [t, useCols, batch]);
      inserted += batch.length;
    } catch {
      // fall back to one-by-one so a single bad row doesn't stop the rest
      for (const one of batch) {
        try {
          await dst.query("INSERT INTO ?? (??) VALUES ?", [t, useCols, [one]]);
          inserted++;
        } catch (e) {
          failed++;
          console.warn(`\n   ! row failed in ${t} (id ${one[useCols.indexOf("id")] ?? "?"}): ${e.message}`);
        }
      }
    }
  }
  const [[{ n }]] = await dst.query("SELECT COUNT(*) AS n FROM ??", [t]);
  console.log(`copied ${inserted}${failed ? `, FAILED ${failed}` : ""} (MySQL now has ${n})`);
  report.push([t, rows.length, n, failed]);
}

await dst.query("SET FOREIGN_KEY_CHECKS=1");
await src.end();
await dst.end();

console.log("\n=== Summary (table, Postgres rows, MySQL rows, failed) ===");
for (const r of report) console.log(r.join("\t"));
if (DO_IMAGES) {
  console.log(`\nImages downloaded: ${imgOk}, failed: ${imgFail}`);
  console.log(`Upload the CONTENTS of ${EXPORT_DIR} into your server's uploads folder (UPLOAD_DIR).`);
}
