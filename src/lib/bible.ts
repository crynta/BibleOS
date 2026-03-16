import type { BookInfo, Verse } from "./types";
import { getDb } from "./db";

export async function getBooks(): Promise<BookInfo[]> {
  const db = await getDb();
  return db.select<BookInfo[]>("SELECT name, chapters FROM books ORDER BY id");
}

export async function getChapter(
  book: string,
  chapter: number,
): Promise<Verse[]> {
  const db = await getDb();
  return db.select<Verse[]>(
    "SELECT verse, text FROM verses WHERE book = ? AND chapter = ? ORDER BY rowid",
    [book, chapter],
  );
}
