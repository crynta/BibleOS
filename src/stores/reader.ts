import { getBooks, getChapter } from "@/lib/bible";
import type { BookInfo, ReaderView, Verse } from "@/lib/types";
import { create } from "zustand";

type ReaderState = {
  books: BookInfo[];
  currentBook: string;
  currentChapter: number;
  verses: Verse[];
  loading: boolean;
  readerView: ReaderView;

  init: () => Promise<void>;
  goTo: (book: string, chapter: number) => Promise<void>;
  nextChapter: () => Promise<void>;
  prevChapter: () => Promise<void>;
  changeReaderView: (readerView: ReaderView) => void;
};

export const useReaderStore = create<ReaderState>((set, get) => ({
  books: [],
  currentBook: "Genesis",
  currentChapter: 1,
  verses: [],
  loading: true,
  readerView: (localStorage.getItem("readerView") || "default") as ReaderView,

  init: async () => {
    const books = await getBooks();
    set({ books });
    if (
      localStorage.getItem("bible-os:last-book") &&
      localStorage.getItem("bible-os:last-chapter")
    ) {
      await get().goTo(
        localStorage.getItem("bible-os:last-book")!,
        parseInt(localStorage.getItem("bible-os:last-chapter")!, 10),
      );
      return;
    }
    localStorage.setItem("bible-os:last-book", "Genesis");
    localStorage.setItem("bible-os:last-chapter", "1");
    await get().goTo("Genesis", 1);
  },

  goTo: async (book, chapter) => {
    set({ loading: true });
    const verses = await getChapter(book, chapter);
    set({ currentBook: book, currentChapter: chapter, verses, loading: false });
    localStorage.setItem("bible-os:last-book", book);
    localStorage.setItem("bible-os:last-chapter", chapter.toString());
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

  changeReaderView: (readerView: ReaderView) => {
    set({ readerView });
    localStorage.setItem("readerView", readerView);
  },
}));
