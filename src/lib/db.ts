import { BaseDirectory, exists, mkdir, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { load } from "@tauri-apps/plugin-store";
import Database from "@tauri-apps/plugin-sql";

const DB_FILE = "bible.db";
/** Bump this whenever bible.db schema changes to force a re-copy on next launch. */
const DB_VERSION = 2;

let _db: Promise<Database> | null = null;

async function setup(): Promise<Database> {
  const store = await load("app.json");
  const storedVersion = (await store.get<number>("db_version")) ?? 0;

  const needsCopy =
    storedVersion !== DB_VERSION ||
    !(await exists(DB_FILE, { baseDir: BaseDirectory.AppData }));

  if (needsCopy) {
    // On Android this reads from APK assets via AssetManager.
    // On desktop it reads from the app's resource directory.
    const data = await readFile(`resources/${DB_FILE}`, {
      baseDir: BaseDirectory.Resource,
    });
    await mkdir("", { baseDir: BaseDirectory.AppData, recursive: true });
    await writeFile(DB_FILE, data, { baseDir: BaseDirectory.AppData });
    await store.set("db_version", DB_VERSION);
  }

  return Database.load(`sqlite:${DB_FILE}`);
}

/** Returns a singleton Database, initialising it on first call. */
export function getDb(): Promise<Database> {
  if (!_db) {
    _db = setup().catch((err) => {
      _db = null; // allow a retry on next call
      throw err;
    });
  }
  return _db;
}
