export type Verse = {
  verse: string;
  text: string;
};

export type BookInfo = {
  name: string;
  chapters: number;
};

export type ReaderView = "stacked" | "default";

export type SearchResult = {
  book: string;
  chapter: number;
  verse: string;
  text: string;
};
