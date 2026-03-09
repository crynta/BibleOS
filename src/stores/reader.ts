import { getBooks, getChapter } from "@/lib/bible";
import type { BookInfo, Verse } from "@/lib/types";
import { create } from "zustand";

type ReaderState = {
  books: BookInfo[];
  currentBook: string;
  currentChapter: number;
  verses: Verse[];
  loading: boolean;

  init: () => Promise<void>;
  goTo: (book: string, chapter: number) => Promise<void>;
  nextChapter: () => Promise<void>;
  prevChapter: () => Promise<void>;
};

export const useReaderStore = create<ReaderState>((set, get) => ({
  books: [],
  currentBook: "Genesis",
  currentChapter: 1,
  verses: [],
  loading: true,

  init: async () => {
    const books = await getBooks();
    set({ books });
    await get().goTo("Genesis", 1);
  },

  goTo: async (book, chapter) => {
    set({ loading: true });
    const verses = await getChapter(book, chapter);
    set({ currentBook: book, currentChapter: chapter, verses, loading: false });
  },

  nextChapter: async () => {
    const { currentBook, currentChapter, books } = get();
    const book = books.find((b) => b.name === currentBook);
    if (!book) return;

    if (currentChapter < book.chapters) {
      await get().goTo(currentBook, currentChapter + 1);
    } else {
      const idx = books.findIndex((b) => b.name === currentBook);
      if (idx < books.length - 1) {
        await get().goTo(books[idx + 1].name, 1);
      }
    }
  },

  prevChapter: async () => {
    const { currentBook, currentChapter, books } = get();

    if (currentChapter > 1) {
      await get().goTo(currentBook, currentChapter - 1);
    } else {
      const idx = books.findIndex((b) => b.name === currentBook);
      if (idx > 0) {
        const prevBook = books[idx - 1];
        await get().goTo(prevBook.name, prevBook.chapters);
      }
    }
  },
}));
