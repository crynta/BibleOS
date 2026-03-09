import { invoke } from "@tauri-apps/api/core";
import type { BookInfo, Verse } from "./types";

export async function getBooks(): Promise<BookInfo[]> {
  return invoke<BookInfo[]>("get_books");
}

export async function getChapter(
  book: string,
  chapter: number,
): Promise<Verse[]> {
  return invoke<Verse[]>("get_chapter", { book, chapter });
}
