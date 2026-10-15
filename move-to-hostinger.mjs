// Pride of Pakistan — switch to MySQL + local image storage (for Hostinger)
// Run from the project folder:  node move-to-hostinger.mjs
const FILES = {"app/api/upload/route.ts":"import { NextRequest, NextResponse } from 'next/server'\nimport { getServerSession } from 'next-auth'\nimport { authOptions } from '@/app/lib/auth'\nimport { saveImage } from '@/app/lib/storage'\n\nconst MAX_BYTES = 8 * 1024 * 1024 // 8 MB\n\nexport async function POST(req: NextRequest) {\n  // Only signed-in users (admins or registered members) may upload\n  const session = await getServerSession(authOptions)\n  if (!session) return NextResponse.json({ error: 'Please sign in to upload.' }, { status: 401 })\n\n  try {\n    const formData = await req.formData()\n    const file = formData.get('file')\n    const folder = String(formData.get('folder') || 'general')\n    if (!(file instanceof File) || file.size === 0)\n      return NextResponse.json({ error: 'No file' }, { status: 400 })\n    if (file.size > MAX_BYTES)\n      return NextResponse.json({ error: 'Image must be under 8 MB.' }, { status: 400 })\n\n    const buffer = Buffer.from(await file.arrayBuffer())\n    let url: string\n    try {\n      url = await saveImage(buffer, folder)\n    } catch {\n      return NextResponse.json({ error: 'Only JPG, PNG, GIF, WEBP or AVIF images can be uploaded.' }, { status: 400 })\n    }\n\n    return NextResponse.json({ success: true, url, path: url })\n  } catch (err) {\n    console.error('Upload error:', err)\n    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })\n  }\n}\n","app/lib/storage.ts":"import { promises as fs } from \"fs\";\nimport path from \"path\";\nimport crypto from \"crypto\";\n\n/**\n * Where uploaded images are kept.\n * On Hostinger set UPLOAD_DIR to a folder OUTSIDE the app's build folder,\n * e.g. /home/u123456789/domains/prideofpakistan.com/uploads\n * (the build folders are wiped on every deploy).\n * Locally it defaults to ./storage in the project.\n */\nexport function uploadRoot(): string {\n  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), \"storage\"));\n}\n\nconst TYPES: { ext: string; mime: string; test: (b: Buffer) => boolean }[] = [\n  { ext: \"jpg\", mime: \"image/jpeg\", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },\n  { ext: \"png\", mime: \"image/png\", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },\n  { ext: \"gif\", mime: \"image/gif\", test: (b) => b.subarray(0, 4).toString(\"ascii\") === \"GIF8\" },\n  { ext: \"webp\", mime: \"image/webp\", test: (b) => b.subarray(0, 4).toString(\"ascii\") === \"RIFF\" && b.subarray(8, 12).toString(\"ascii\") === \"WEBP\" },\n  { ext: \"avif\", mime: \"image/avif\", test: (b) => b.subarray(4, 12).toString(\"ascii\").startsWith(\"ftypavi\") },\n];\n\nexport const MIME_BY_EXT: Record<string, string> = {\n  jpg: \"image/jpeg\", jpeg: \"image/jpeg\", png: \"image/png\", gif: \"image/gif\",\n  webp: \"image/webp\", avif: \"image/avif\",\n};\n\n/** Checks the real file contents (not the browser's claim) — only real images pass. */\nexport function detectImage(buf: Buffer) {\n  return TYPES.find((t) => buf.length > 12 && t.test(buf)) ?? null;\n}\n\n/**\n * Saves an image buffer and returns its public URL, e.g. /media/businesses/2026/10/ab12cd34.jpg\n * Throws if the file is not a supported image.\n */\nexport async function saveImage(buf: Buffer, folder = \"general\"): Promise<string> {\n  const kind = detectImage(buf);\n  if (!kind) throw new Error(\"Unsupported image type\");\n\n  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, \"\").toLowerCase() || \"general\";\n  const now = new Date();\n  const rel = path.posix.join(\n    safeFolder,\n    String(now.getFullYear()),\n    String(now.getMonth() + 1).padStart(2, \"0\"),\n    `${crypto.randomBytes(12).toString(\"hex\")}.${kind.ext}`,\n  );\n\n  const full = path.join(uploadRoot(), ...rel.split(\"/\"));\n  await fs.mkdir(path.dirname(full), { recursive: true });\n  await fs.writeFile(full, buf);\n  return `/media/${rel}`;\n}\n","app/media/[...path]/route.ts":"import { NextRequest } from \"next/server\";\nimport { promises as fs } from \"fs\";\nimport path from \"path\";\nimport { uploadRoot, MIME_BY_EXT } from \"@/app/lib/storage\";\n\nexport const dynamic = \"force-dynamic\";\n\n/** Serves uploaded images from UPLOAD_DIR at /media/... */\nexport async function GET(\n  _req: NextRequest,\n  { params }: { params: Promise<{ path: string[] }> },\n) {\n  const { path: parts } = await params;\n  const root = uploadRoot();\n  const full = path.resolve(root, ...(parts ?? []).map((p) => decodeURIComponent(p)));\n\n  // block ../ tricks — the file must be inside the upload folder\n  if (!full.startsWith(root + path.sep)) return new Response(\"Not found\", { status: 404 });\n\n  const ext = path.extname(full).slice(1).toLowerCase();\n  const mime = MIME_BY_EXT[ext];\n  if (!mime) return new Response(\"Not found\", { status: 404 });\n\n  try {\n    const data = await fs.readFile(full);\n    return new Response(new Uint8Array(data), {\n      headers: {\n        \"Content-Type\": mime,\n        \"Cache-Control\": \"public, max-age=31536000, immutable\",\n        \"X-Content-Type-Options\": \"nosniff\",\n      },\n    });\n  } catch {\n    return new Response(\"Not found\", { status: 404 });\n  }\n}\n","hostinger-move/copy-data.mjs":"// Copies every table from Supabase (PostgreSQL) to Hostinger (MySQL/MariaDB).\n// Optional: --images  downloads all Cloudinary images into ./storage-export\n//                      and rewrites their links to /media/cloudinary/...\n//\n// Usage (PowerShell, inside the hostinger-move folder):\n//   $env:PG_URL=\"postgresql://...supabase...\"      (Supabase SESSION/direct connection string)\n//   $env:MYSQL_URL=\"mysql://user:pass@host:3306/dbname\"\n//   node copy-data.mjs --images\n//\n// Safe to run again: it empties the MySQL tables first, then copies fresh.\nimport pg from \"pg\";\nimport mysql from \"mysql2/promise\";\nimport fs from \"fs/promises\";\nimport path from \"path\";\n\nconst PG_URL = process.env.PG_URL;\nconst MYSQL_URL = process.env.MYSQL_URL;\nconst DO_IMAGES = process.argv.includes(\"--images\");\nconst EXPORT_DIR = path.resolve(\"storage-export\");\n\nif (!PG_URL || !MYSQL_URL) {\n  console.error(\"Set PG_URL and MYSQL_URL first (see top of this file).\");\n  process.exit(1);\n}\n\n// Keep timestamps exactly as stored — no timezone shifting\npg.types.setTypeParser(1114, (s) => s); // timestamp\npg.types.setTypeParser(1184, (s) => new Date(s).toISOString().replace(\"T\", \" \").replace(\"Z\", \"\")); // timestamptz -> UTC\npg.types.setTypeParser(1082, (s) => s); // date\n\nconst src = new pg.Client({ connectionString: PG_URL, ssl: { rejectUnauthorized: false } });\nawait src.connect();\nconst dst = await mysql.createConnection({ uri: MYSQL_URL, multipleStatements: false, dateStrings: true });\n\n// ── Cloudinary image handling ───────────────────────────────────────────────\nconst CLD_RE = /https?:\\/\\/res\\.cloudinary\\.com\\/[^/\\s\"'<>]+\\/image\\/upload\\/([^\\s\"'<>?#)]+)/g;\nconst downloaded = new Map(); // url -> local link\nlet imgOk = 0, imgFail = 0;\n\nasync function fetchImage(url, relPath) {\n  if (downloaded.has(url)) return downloaded.get(url);\n  const safe = relPath.split(\"/\").map((p) => p.replace(/[^a-zA-Z0-9._-]/g, \"_\")).join(\"/\");\n  const local = `/media/cloudinary/${safe}`;\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    const buf = Buffer.from(await res.arrayBuffer());\n    const file = path.join(EXPORT_DIR, \"cloudinary\", ...safe.split(\"/\"));\n    await fs.mkdir(path.dirname(file), { recursive: true });\n    await fs.writeFile(file, buf);\n    imgOk++;\n    downloaded.set(url, local);\n    return local;\n  } catch (e) {\n    imgFail++;\n    console.warn(`   ! could not download ${url} (${e.message}) — keeping original link`);\n    downloaded.set(url, url);\n    return url;\n  }\n}\n\nasync function rewriteString(s) {\n  const matches = [...s.matchAll(CLD_RE)];\n  if (!matches.length) return s;\n  let out = s;\n  for (const m of matches) out = out.split(m[0]).join(await fetchImage(m[0], m[1]));\n  return out;\n}\n\nasync function rewriteDeep(v) {\n  if (typeof v === \"string\") return rewriteString(v);\n  if (Array.isArray(v)) return Promise.all(v.map(rewriteDeep));\n  if (v && typeof v === \"object\" && !(v instanceof Date) && !Buffer.isBuffer(v)) {\n    const o = {};\n    for (const [k, x] of Object.entries(v)) o[k] = await rewriteDeep(x);\n    return o;\n  }\n  return v;\n}\n\n// ── Copy tables ─────────────────────────────────────────────────────────────\nconst { rows: tables } = await src.query(\n  `SELECT table_name FROM information_schema.tables\n   WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name <> '_prisma_migrations'\n   ORDER BY table_name`,\n);\n\nconst [myTables] = await dst.query(\"SHOW TABLES\");\nconst mySet = new Set(myTables.map((r) => Object.values(r)[0]));\n\nawait dst.query(\"SET FOREIGN_KEY_CHECKS=0\");\nconst report = [];\n\nfor (const { table_name: t } of tables) {\n  if (!mySet.has(t)) {\n    console.log(`- skip ${t} (not in MySQL schema)`);\n    report.push([t, \"skipped\", \"\", \"\"]);\n    continue;\n  }\n  const [cols] = await dst.query(\n    \"SELECT COLUMN_NAME, DATA_TYPE FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?\",\n    [t],\n  );\n  const myCols = new Map(cols.map((c) => [c.COLUMN_NAME, c.DATA_TYPE]));\n\n  const { rows } = await src.query(`SELECT * FROM \"${t}\"`);\n  const useCols = rows.length ? Object.keys(rows[0]).filter((c) => myCols.has(c)) : [];\n\n  await dst.query(\"DELETE FROM ??\", [t]);\n  process.stdout.write(`- ${t}: ${rows.length} rows ... `);\n\n  const values = [];\n  for (const r of rows) {\n    const line = [];\n    for (const c of useCols) {\n      let v = r[c];\n      if (DO_IMAGES) v = await rewriteDeep(v);\n      if (v !== null && typeof v === \"object\" && !Buffer.isBuffer(v)) v = JSON.stringify(v);\n      if (typeof v === \"boolean\") v = v ? 1 : 0;\n      line.push(v);\n    }\n    values.push(line);\n  }\n\n  let inserted = 0, failed = 0;\n  for (let i = 0; i < values.length; i += 200) {\n    const batch = values.slice(i, i + 200);\n    try {\n      await dst.query(\"INSERT INTO ?? (??) VALUES ?\", [t, useCols, batch]);\n      inserted += batch.length;\n    } catch {\n      // fall back to one-by-one so a single bad row doesn't stop the rest\n      for (const one of batch) {\n        try {\n          await dst.query(\"INSERT INTO ?? (??) VALUES ?\", [t, useCols, [one]]);\n          inserted++;\n        } catch (e) {\n          failed++;\n          console.warn(`\\n   ! row failed in ${t} (id ${one[useCols.indexOf(\"id\")] ?? \"?\"}): ${e.message}`);\n        }\n      }\n    }\n  }\n  const [[{ n }]] = await dst.query(\"SELECT COUNT(*) AS n FROM ??\", [t]);\n  console.log(`copied ${inserted}${failed ? `, FAILED ${failed}` : \"\"} (MySQL now has ${n})`);\n  report.push([t, rows.length, n, failed]);\n}\n\nawait dst.query(\"SET FOREIGN_KEY_CHECKS=1\");\nawait src.end();\nawait dst.end();\n\nconsole.log(\"\\n=== Summary (table, Postgres rows, MySQL rows, failed) ===\");\nfor (const r of report) console.log(r.join(\"\\t\"));\nif (DO_IMAGES) {\n  console.log(`\\nImages downloaded: ${imgOk}, failed: ${imgFail}`);\n  console.log(`Upload the CONTENTS of ${EXPORT_DIR} into your server's uploads folder (UPLOAD_DIR).`);\n}\n","hostinger-move/package.json":"{\n  \"name\": \"hostinger-move\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"dependencies\": {\n    \"mysql2\": \"^3.11.0\",\n    \"pg\": \"^8.13.0\"\n  }\n}\n"};
import fs from "fs";
import path from "path";

const root = process.cwd();
if (!fs.existsSync(path.join(root, "prisma", "schema.prisma"))) {
  console.error("Run this from the project folder (where the prisma folder is).");
  process.exit(1);
}
const log = (ok, msg) => console.log(`${ok ? "OK  " : "!!  "} ${msg}`);
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };

// 1. New / replaced files
for (const [p, s] of Object.entries(FILES)) { write(p, s); log(true, `wrote ${p}`); }

// 2. Prisma schema -> MySQL
{
  let s = read("prisma/schema.prisma");
  s = s.replace(/provider\s*=\s*"postgresql"/, 'provider  = "mysql"');
  s = s.replace(/\n\s*directUrl\s*=\s*env\("DIRECT_URL"\)/, "");
  s = s.replace(/likedBy(\s+)Json(\s+)@default\("\[\]"\)/, "likedBy$1Json");
  write("prisma/schema.prisma", s);
  log(s.includes('"mysql"'), "schema.prisma now uses mysql");
}

// 3. Remove Postgres-only  mode: "insensitive"  (MySQL search is already case-insensitive)
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== "node_modules" && f !== ".next") walk(p); }
    else if (/\.(ts|tsx)$/.test(f)) {
      const s = fs.readFileSync(p, "utf8");
      const n = s.replace(/,\s*mode:\s*["']insensitive["'](\s+as\s+const)?/g, "").replace(/mode:\s*["']insensitive["'](\s+as\s+const)?\s*,?/g, "");
      if (n !== s) { fs.writeFileSync(p, n); log(true, `removed mode:"insensitive" in ${path.relative(root, p)}`); }
    }
  }
}
walk(path.join(root, "app"));

// 4. Comments: likedBy has no database default in MySQL, so set it on create
{
  const p = "app/api/comments/route.ts";
  if (fs.existsSync(path.join(root, p))) {
    let s = read(p);
    if (!/likedBy:\s*\[\]/.test(s)) {
      s = s.replace(/(prisma\.comment\.create\(\{\s*data:\s*\{)/, "$1\n        likedBy: [],");
      write(p, s);
    }
    log(/likedBy:\s*\[\]/.test(s), `${p} sets likedBy: []`);
  }
}

// 5. Cloudinary -> local storage in list-business and submit-profile
for (const [p, folder] of [["app/api/list-business/route.ts", "businesses"], ["app/api/submit-profile/route.ts", "profiles"]]) {
  if (!fs.existsSync(path.join(root, p))) { log(false, `${p} not found — skipped`); continue; }
  let s = read(p);
  s = s.replace(/import\s*\{\s*v2 as cloudinary\s*\}\s*from\s*["']cloudinary["'];?\s*\n/, 'import { saveImage } from "@/app/lib/storage";\n');
  s = s.replace(/cloudinary\.config\(\{[\s\S]*?\}\);?\s*\n/, "");
  s = s.replace(
    /const result = await new Promise<\{\s*secure_url: string\s*\}>\([\s\S]*?\.end\(buffer\);\s*\},?\s*\);\s*imageUrl = result\.secure_url;/,
    `imageUrl = await saveImage(buffer, "${folder}");`,
  );
  s = s.replace(/Upload image to Cloudinary/g, "Save image to our own storage").replace(/Cloudinary upload error/g, "Image save error");
  write(p, s);
  log(!s.includes("cloudinary") && s.includes("saveImage("), `${p} now saves images locally${s.includes("cloudinary") ? " — STILL MENTIONS cloudinary, send me this file" : ""}`);
}

// 6. Any other Cloudinary uploads left?
const left = [];
(function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== "node_modules") scan(p); }
    else if (/\.(ts|tsx|js|mjs)$/.test(f) && /from\s+["'](next-)?cloudinary["']|cloudinary\.uploader/.test(fs.readFileSync(p, "utf8"))) left.push(path.relative(root, p));
  }
})(path.join(root, "app"));
log(left.length === 0, left.length ? `Cloudinary still used in: ${left.join(", ")} — send me these files` : "no Cloudinary uploads left in app/");

// 7. Keep uploaded images and exports out of git
{
  let g = fs.existsSync(path.join(root, ".gitignore")) ? read(".gitignore") : "";
  for (const line of ["/storage/", "hostinger-move/node_modules/", "hostinger-move/storage-export/"]) if (!g.includes(line)) g += `\n${line}`;
  write(".gitignore", g.trimEnd() + "\n");
  log(true, ".gitignore updated");
}

console.log("\nDone. Next: follow the steps I gave you (create MySQL database, prisma db push, copy data).");
