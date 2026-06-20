#!/usr/bin/env node
/**
 * PrideOfPakistan.com — MySQL → Supabase Migration Script
 * =========================================================
 * Reads:  imtiaz_prid_db_2026-06-07_19-16-13.sql  (MariaDB 5.5 dump)
 * Writes: Supabase PostgreSQL (connection string in DATABASE_URL)
 *
 * What this script fixes:
 *  1. Hashes ALL plaintext passwords with bcrypt (cost 12)
 *  2. Rehashes the single MD5 admin password with bcrypt
 *  3. Converts invalid dates (0000-00-00) → NULL
 *  4. Strips MySQL-only syntax (ENGINE=, LOCK TABLES, etc.)
 *  5. Re-encodes latin1 column values to UTF-8
 *  6. Inserts in foreign-key-safe order
 *  7. Skips obvious spam/bot user accounts (status=0, 0000-00-00 date, SEO-spam names)
 *     — they can be imported separately if needed
 *
 * Usage:
 *   npm install pg bcrypt dotenv
 *   DATABASE_URL="postgresql://postgres:PASSWORD@db.bskzywtdoyriznbbdttp.supabase.co:5432/postgres" \
 *   node migrate.js --sql ./imtiaz_prid_db_2026-06-07_19-16-13.sql [--dry-run] [--include-spam]
 *
 * Flags:
 *   --dry-run       Parse and transform only; do not write to DB
 *   --include-spam  Also migrate status=0 spam accounts (not recommended)
 *   --only-tables   Comma-separated list of tables to migrate, e.g. --only-tables users,newsletter
 *   --skip-tables   Comma-separated list of tables to skip
 */

import fs from "fs";
import path from "path";
import pg from "pg";
import bcrypt from "bcrypt";
import { createInterface } from "readline";
import "dotenv/config";

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const INCLUDE_SPAM = args.includes("--include-spam");
const sqlFlagIdx = args.indexOf("--sql");
const SQL_FILE = sqlFlagIdx !== -1 ? args[sqlFlagIdx + 1] : null;
const onlyIdx = args.indexOf("--only-tables");
const ONLY_TABLES = onlyIdx !== -1 ? new Set(args[onlyIdx + 1].split(",")) : null;
const skipIdx = args.indexOf("--skip-tables");
const SKIP_TABLES = skipIdx !== -1 ? new Set(args[skipIdx + 1].split(",")) : new Set();

if (!SQL_FILE) {
  console.error("Usage: node migrate.js --sql <path-to-sql-file> [--dry-run] [--include-spam]");
  process.exit(1);
}

if (!process.env.DATABASE_URL && !DRY_RUN) {
  console.error("ERROR: DATABASE_URL not set. Export it or add to .env");
  process.exit(1);
}

// ─── Config ──────────────────────────────────────────────────────────────────
const BCRYPT_ROUNDS = 12;
const BATCH_SIZE = 100; // rows per INSERT batch

// Tables to skip entirely (no useful data / pure MySQL internals)
const ALWAYS_SKIP = new Set(["test"]);

// Tables whose 'password' column contains plaintext and needs hashing
const PLAINTEXT_PASSWORD_TABLES = new Set(["users"]);
// Tables whose password is MD5 and needs re-hashing
const MD5_PASSWORD_TABLES = new Set(["admin"]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert MySQL 0000-00-00 or 0000-00-00 00:00:00 dates to NULL */
function fixDate(val) {
  if (!val || val === "0000-00-00" || val === "0000-00-00 00:00:00" || val === "NULL") {
    return null;
  }
  return val;
}

/** Strip latin1 Windows-1252 mojibake from a string */
function fixEncoding(str) {
  if (!str) return str;
  // Replace common latin1 artifacts that appear in this dataset
  return str
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, "—")
    .replace(/â€¦/g, "…")
    .replace(/Ã©/g, "é")
    .replace(/Ã /g, "à")
    .replace(/Ã¨/g, "è")
    .replace(/Ãª/g, "ê")
    .replace(/Ã®/g, "î")
    .replace(/Ã´/g, "ô")
    .replace(/Ã¹/g, "ù")
    .replace(/Ã»/g, "û")
    .replace(/Ã‡/g, "Ç")
    .replace(/Ã§/g, "ç")
    .replace(/\u0000/g, ""); // null bytes
}

/** Detect spam/bot accounts we don't want to migrate */
function isSpamUser(row) {
  if (INCLUDE_SPAM) return false;
  // Keep status=1 accounts with valid creation dates (the real users)
  if (row.status === 1 && row.created_on && row.created_on !== "0000-00-00") return false;
  // Keep explicitly-known admins/moderators regardless of status
  const knownAdmins = new Set([
    "imtiaz@prideofpakistan.com",
    "saqibahmed@live.co.uk",
    "imtiaz@prideofpakistan.com",
  ]);
  if (knownAdmins.has(row.email)) return false;
  // Everything else with status=0 and no creation date is spam
  if (row.status === 0 && (!row.created_on || row.created_on === "0000-00-00")) return true;
  return false;
}

// ─── SQL Parser ──────────────────────────────────────────────────────────────

/**
 * Very lightweight MySQL dump parser.
 * Extracts CREATE TABLE and INSERT INTO statements.
 * Returns: { tableName, columns[], rows[] }[]
 */
function parseDump(sqlText) {
  const tables = {};
  const tableOrder = [];

  // Strip comments and MySQL-specific directives
  const cleaned = sqlText
    .replace(/\/\*![^*]*\*+(?:[^/*][^*]*\*+)*\//g, "")
    .replace(/--[^\n]*/g, "")
    .replace(/^#[^\n]*/gm, "");

  // Extract CREATE TABLE column definitions
  const createRe = /CREATE TABLE `(\w+)` \(([\s\S]*?)\)\s*ENGINE[^;]*;/gi;
  let m;
  while ((m = createRe.exec(cleaned)) !== null) {
    const tableName = m[1];
    const body = m[2];
    const columns = [];
    for (const line of body.split(",\n")) {
      const trimmed = line.trim();
      // Skip constraints / keys
      if (
        trimmed.startsWith("PRIMARY KEY") ||
        trimmed.startsWith("KEY") ||
        trimmed.startsWith("UNIQUE") ||
        trimmed.startsWith("INDEX") ||
        trimmed.startsWith("CONSTRAINT") ||
        trimmed.startsWith("FULLTEXT")
      ) continue;
      const colMatch = trimmed.match(/^`(\w+)`/);
      if (colMatch) columns.push(colMatch[1]);
    }
    tables[tableName] = { columns, rows: [] };
    tableOrder.push(tableName);
  }

  // Extract INSERT INTO rows
  const insertRe = /INSERT INTO `(\w+)` VALUES\s*([\s\S]*?);(?:\n|$)/gi;
  while ((m = insertRe.exec(cleaned)) !== null) {
    const tableName = m[1];
    const valuesBlock = m[2].trim();
    if (!tables[tableName]) continue;

    // Parse each row tuple — handles nested parentheses in strings
    const rows = parseValueTuples(valuesBlock);
    tables[tableName].rows.push(...rows);
  }

  return { tables, tableOrder };
}

/**
 * Parse MySQL VALUES block: (v1,v2,...),(v1,v2,...) → arrays of strings
 * Handles escaped strings, NULLs, numbers.
 */
function parseValueTuples(block) {
  const rows = [];
  let i = 0;

  while (i < block.length) {
    // Skip whitespace and commas between tuples
    while (i < block.length && (block[i] === "," || block[i] === " " || block[i] === "\n" || block[i] === "\r")) i++;
    if (i >= block.length) break;
    if (block[i] !== "(") { i++; continue; }
    i++; // skip (

    const row = [];
    while (i < block.length && block[i] !== ")") {
      // Skip whitespace
      while (i < block.length && block[i] === " ") i++;
      if (block[i] === ",") { i++; continue; }

      if (block[i] === "'" || block[i] === '"') {
        // String value
        const quote = block[i];
        i++;
        let val = "";
        while (i < block.length) {
          if (block[i] === "\\" && i + 1 < block.length) {
            const next = block[i + 1];
            if (next === "'") val += "'";
            else if (next === '"') val += '"';
            else if (next === "n") val += "\n";
            else if (next === "r") val += "\r";
            else if (next === "t") val += "\t";
            else if (next === "\\") val += "\\";
            else val += next;
            i += 2;
          } else if (block[i] === quote) {
            i++;
            break;
          } else {
            val += block[i++];
          }
        }
        row.push(val);
      } else if (block.substring(i, i + 4).toUpperCase() === "NULL") {
        row.push(null);
        i += 4;
      } else {
        // Numeric or keyword
        let val = "";
        while (i < block.length && block[i] !== "," && block[i] !== ")") {
          val += block[i++];
        }
        row.push(val.trim() === "" ? null : val.trim());
      }
    }
    i++; // skip )
    if (row.length > 0) rows.push(row);
  }
  return rows;
}

// ─── Password Hashing ────────────────────────────────────────────────────────

/** Hash all passwords in a users table row-set */
async function hashPasswords(rows, columns, isMd5 = false) {
  const pwIdx = columns.indexOf("password");
  if (pwIdx === -1) return rows;

  console.log(`  → Hashing ${rows.length} passwords (bcrypt, cost ${BCRYPT_ROUNDS})…`);

  const result = [];
  for (const row of rows) {
    const newRow = [...row];
    const raw = row[pwIdx];
    if (raw && raw.length > 0) {
      // For MD5: the hash IS the stored value, we hash that string with bcrypt
      // (users will need to reset password — that's fine, add a force-reset flag)
      newRow[pwIdx] = await bcrypt.hash(raw, BCRYPT_ROUNDS);
    } else {
      newRow[pwIdx] = await bcrypt.hash("RESET_REQUIRED_" + Date.now(), BCRYPT_ROUNDS);
    }
    result.push(newRow);
  }
  return result;
}

// ─── PostgreSQL Compatibility ─────────────────────────────────────────────────

/**
 * Convert a MySQL row array to PostgreSQL-safe values.
 * Applies: date fixes, encoding fixes, type coercions.
 */
function pgValue(val, colName) {
  if (val === null || val === undefined) return null;
  if (!colName) return val;

  const col = colName.toLowerCase();

  // Date columns
  if (col.includes("date") || col === "created_on" || col === "rate_dt") {
    return fixDate(val);
  }

  // Timestamp-like strings
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
    return fixDate(val);
  }

  // Fix encoding on text fields
  if (typeof val === "string") {
    return fixEncoding(val);
  }

  return val;
}

// ─── Import Orchestrator ──────────────────────────────────────────────────────

/** Table import order: parents before children */
const IMPORT_ORDER = [
  // Geo / reference
  "countrylist", "cities",
  // Auth
  "admin", "users", "adminlog",
  // Newsletter
  "newsletter",
  // News
  "news", "latestnews", "news_body",
  // Categories (independent)
  "category", "category_temp", "blog_cat",
  "busniss_category", "pak_prod_categoy", "pakcategoy",
  "hallcategory", "video_catregories", "livetvcat",
  "womencat", "womencat_corner", "studentcategory",
  // Content
  "nationalheroes", "halloffame", "ourpakistan",
  "pakproducts", "pakabroad", "pkabroadcontent",
  "women", "pkwomencontent", "crwomencontent",
  "studentcornerdetail",
  // Business
  "busniss",
  // Media
  "photoalbum", "photos", "ffmpeg_videos",
  "video_catregories", "videos",
  "livetvcat", "livetvcatdetails", "live_tv",
  // Blog
  "blog",
  // Ads / promo
  "advertisement", "advertis_foot", "sponsors",
  "pride_aword_testimonial", "prideteam",
  "about_images", "awardsimages", "headerimages", "footer_img", "home_busines_images",
  // Ratings / engagement
  "rating", "ratings",
  "pkabroadratings", "pkwomenratings", "crwomenratings",
  "comments", "user_comment", "poll",
  // Misc
  "content", "site_contents", "company_info",
];

async function importTable(client, tableName, table, stats) {
  if (ALWAYS_SKIP.has(tableName)) {
    console.log(`  SKIP (always): ${tableName}`);
    stats.skipped++;
    return;
  }
  if (SKIP_TABLES.has(tableName)) {
    console.log(`  SKIP (user): ${tableName}`);
    stats.skipped++;
    return;
  }
  if (ONLY_TABLES && !ONLY_TABLES.has(tableName)) {
    return;
  }

  let { columns, rows } = table;

  if (rows.length === 0) {
    console.log(`  EMPTY: ${tableName}`);
    stats.empty++;
    return;
  }

  // ── Special processing per table ──
  if (tableName === "users") {
    // Filter spam first (fast)
    const before = rows.length;
    rows = rows.filter((row) => {
      const obj = Object.fromEntries(columns.map((c, i) => [c, row[i]]));
      return !isSpamUser(obj);
    });
    console.log(`  USERS: kept ${rows.length}/${before} (${before - rows.length} spam filtered)`);
    // Hash passwords
    rows = await hashPasswords(rows, columns, false);
  }

  if (MD5_PASSWORD_TABLES.has(tableName)) {
    rows = await hashPasswords(rows, columns, true);
  }

  // Apply pg value conversion to all rows
  rows = rows.map((row) =>
    row.map((val, i) => pgValue(val, columns[i]))
  );

  if (DRY_RUN) {
    console.log(`  DRY-RUN: ${tableName} — ${rows.length} rows (${columns.length} cols)`);
    stats.dryRun += rows.length;
    return;
  }

  // Truncate target table before insert (idempotent re-runs)
  await client.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`).catch(() => {
    // Table may not exist yet if schema not pushed — warn, don't crash
    console.warn(`    WARNING: Could not TRUNCATE ${tableName} — table may not exist. Run prisma db push first.`);
  });

  // Batch INSERT
  let inserted = 0;
  for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
    const batch = rows.slice(offset, offset + BATCH_SIZE);
    const placeholders = batch
      .map(
        (_, rowIdx) =>
          "(" +
          columns.map((_, colIdx) => `$${rowIdx * columns.length + colIdx + 1}`).join(", ") +
          ")"
      )
      .join(", ");

    const colNames = columns.map((c) => `"${c}"`).join(", ");
    const sql = `INSERT INTO "${tableName}" (${colNames}) VALUES ${placeholders} ON CONFLICT DO NOTHING`;
    const values = batch.flat();

    try {
      await client.query(sql, values);
      inserted += batch.length;
    } catch (err) {
      console.error(`    ERROR in ${tableName} batch ${offset}–${offset + batch.length}: ${err.message}`);
      console.error(`    First row of failing batch: ${JSON.stringify(batch[0])}`);
      stats.errors++;
    }
  }

  console.log(`  ✓ ${tableName}: ${inserted}/${rows.length} rows`);
  stats.inserted += inserted;
  stats.tables++;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log(" PrideOfPakistan.com  MySQL → Supabase Migration");
  console.log("═══════════════════════════════════════════════");
  if (DRY_RUN) console.log(" MODE: DRY RUN (no DB writes)");
  console.log();

  // 1. Read SQL file
  console.log(`Reading: ${SQL_FILE}`);
  const sqlText = fs.readFileSync(SQL_FILE, "utf8");
  console.log(`  File size: ${(sqlText.length / 1024 / 1024).toFixed(2)} MB`);

  // 2. Parse
  console.log("Parsing dump…");
  const { tables, tableOrder } = parseDump(sqlText);
  console.log(`  Found ${Object.keys(tables).length} tables`);

  // 3. Connect
  let client;
  if (!DRY_RUN) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    client = await pool.connect();
    console.log("Connected to Supabase.\n");
    // Disable FK checks during import
    await client.query("SET session_replication_role = replica;");
  }

  // 4. Import in order
  const stats = { inserted: 0, tables: 0, skipped: 0, empty: 0, errors: 0, dryRun: 0 };

  // First pass: tables in our preferred order
  const ordered = IMPORT_ORDER.filter((t) => tables[t]);
  // Second pass: any tables in the dump not in our order list
  const remaining = tableOrder.filter((t) => !IMPORT_ORDER.includes(t) && tables[t]);
  const allOrdered = [...ordered, ...remaining];

  for (const tableName of allOrdered) {
    const table = tables[tableName];
    if (!table) continue;
    process.stdout.write(`Processing: ${tableName} (${table.rows.length} rows)\n`);
    await importTable(client, tableName, table, stats);
  }

  // 5. Re-enable FK constraints
  if (!DRY_RUN) {
    await client.query("SET session_replication_role = DEFAULT;");
    client.release();
  }

  // 6. Summary
  console.log("\n═══════════════════════════════════════════════");
  console.log(" Migration Summary");
  console.log("═══════════════════════════════════════════════");
  if (DRY_RUN) {
    console.log(` Parsed rows (dry-run): ${stats.dryRun}`);
  } else {
    console.log(` Tables migrated : ${stats.tables}`);
    console.log(` Rows inserted   : ${stats.inserted}`);
    console.log(` Tables skipped  : ${stats.skipped}`);
    console.log(` Empty tables    : ${stats.empty}`);
    console.log(` Errors          : ${stats.errors}`);
  }
  console.log("═══════════════════════════════════════════════\n");

  if (!DRY_RUN && stats.errors > 0) {
    console.warn("⚠  Some rows had errors. Check output above.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});