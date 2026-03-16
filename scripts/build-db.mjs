#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOKS_DIR = join(__dirname, "../src-tauri/resources/books");
const OUT = join(__dirname, "../src-tauri/resources/bible.db");
const SQL_TMP = join(tmpdir(), "bible-build.sql");

if (existsSync(OUT)) unlinkSync(OUT);

console.log("Building bible.db …");

const lines = [];

lines.push("PRAGMA journal_mode = WAL;");
lines.push("PRAGMA synchronous  = OFF;");
lines.push("PRAGMA cache_size   = -65536;");

lines.push(`
CREATE TABLE books (
  id       INTEGER PRIMARY KEY,
  name     TEXT    NOT NULL UNIQUE,
  chapters INTEGER NOT NULL
);

CREATE TABLE verses (
  id      INTEGER PRIMARY KEY,
  book    TEXT    NOT NULL,
  chapter INTEGER NOT NULL,
  verse   TEXT    NOT NULL,
  text    TEXT    NOT NULL
);

CREATE INDEX idx_verses_lookup ON verses (book, chapter);

CREATE VIRTUAL TABLE verses_fts USING fts5 (
  text,
  book    UNINDEXED,
  chapter UNINDEXED,
  verse   UNINDEXED,
  content       = 'verses',
  content_rowid = 'id',
  tokenize      = 'porter unicode61'
);
`);

lines.push("BEGIN;");

const bookNames = JSON.parse(
  readFileSync(join(BOOKS_DIR, "Books.json"), "utf8"),
);

for (const name of bookNames) {
  const { count, chapters } = JSON.parse(
    readFileSync(join(BOOKS_DIR, `${name}.json`), "utf8"),
  );
  const escapedName = name.replace(/'/g, "''");
  lines.push(
    `INSERT INTO books (name, chapters) VALUES ('${escapedName}', ${count});`,
  );
  for (const ch of chapters) {
    const chNum = parseInt(ch.chapter, 10);
    for (const v of ch.verses) {
      const text = v.text.replace(/'/g, "''");
      const verse = String(v.verse).replace(/'/g, "''");
      lines.push(
        `INSERT INTO verses (book, chapter, verse, text) VALUES ('${escapedName}', ${chNum}, '${verse}', '${text}');`,
      );
    }
  }
}

lines.push("COMMIT;");

lines.push(`
INSERT INTO verses_fts (rowid, text, book, chapter, verse)
SELECT id, text, book, chapter, verse FROM verses;

INSERT INTO verses_fts (verses_fts) VALUES ('optimize');

PRAGMA wal_checkpoint(TRUNCATE);
VACUUM;
ANALYZE;
`);

writeFileSync(SQL_TMP, lines.join("\n"), "utf8");

execFileSync("sqlite3", [OUT], {
  input: readFileSync(SQL_TMP),
  stdio: ["pipe", "inherit", "inherit"],
});

unlinkSync(SQL_TMP);

const bytes = statSync(OUT).size;
console.log(`${OUT}  (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
