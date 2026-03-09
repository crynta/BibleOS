import { ScrollArea } from "@/components/ui/scroll-area";
import { useReaderStore } from "@/stores/reader";
import { useEffect, useRef } from "react";

export function Reader() {
  const { currentBook, currentChapter, verses, loading, books } =
    useReaderStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const bookInfo = books.find((b) => b.name === currentBook);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [currentBook, currentChapter]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <article className="mx-auto max-w-2xl px-8 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {currentBook}
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            Chapter {currentChapter}/{bookInfo?.chapters}
          </p>
        </header>

        <div className="space-y-1">
          {verses.map((verse) => (
            <span key={verse.verse} className="group inline">
              <sup className="mr-1 text-xs font-medium text-muted-foreground/60 select-none">
                {verse.verse}
              </sup>
              <span className="text-[16px] leading-[1.8] text-foreground/90">
                {verse.text}{" "}
              </span>
            </span>
          ))}
        </div>
      </article>
    </ScrollArea>
  );
}
