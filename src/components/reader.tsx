import { useReaderStore } from "@/stores/reader";
import { useEffect, useRef } from "react";

export function Reader() {
  const { currentBook, currentChapter, verses, loading, books, readerView } =
    useReaderStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const bookInfo = books.find((b) => b.name === currentBook);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [currentBook, currentChapter]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      <article className={"mx-auto max-w-xl py-10"}>
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {currentBook}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Chapter {currentChapter}/{bookInfo?.chapters}
          </p>
        </header>

        {readerView === "default" ? (
          <div className="space-y-1 cursor-text mx-8">
            {verses.map((verse) => (
              <span key={verse.verse} className="group inline">
                <sup className="mr-1 select-none text-xs font-medium text-muted-foreground/60">
                  {verse.verse}
                </sup>
                <span className="text-[16px] leading-[1.8] text-foreground/90">
                  {verse.text}{" "}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 mx-5">
            {verses.map((verse) => (
              <span
                key={verse.verse}
                className="group inline hover:bg-muted/45 px-3 rounded-lg py-1"
              >
                <span className="mr-2 select-none font-medium text-muted-foreground/60">
                  {verse.verse}.
                </span>
                <span className="text-[16px] leading-[1.8] text-foreground/90">
                  {verse.text}{" "}
                </span>
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
