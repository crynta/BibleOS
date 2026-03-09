import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useReaderStore } from "@/stores/reader";
import { BookOpenIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const OT_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song Of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
  "Haggai", "Zechariah", "Malachi",
];

type Step = "book" | "chapter";

export function BookSelector() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("book");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const { books, goTo } = useReaderStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setStep("book");
      setSelectedBook(null);
    }
  }, []);

  const handleSelectBook = useCallback((book: string) => {
    setSelectedBook(book);
    setStep("chapter");
  }, []);

  const handleSelectChapter = useCallback(
    async (chapter: number) => {
      if (!selectedBook) return;
      await goTo(selectedBook, chapter);
      handleOpenChange(false);
    },
    [selectedBook, goTo, handleOpenChange],
  );

  const bookInfo = books.find((b) => b.name === selectedBook);

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Go to passage"
      description="Search for a book and chapter"
    >
      <Command>
        <CommandInput
          placeholder={step === "book" ? "Search books..." : `${selectedBook} — pick a chapter`}
        />
        <CommandList>
          <CommandEmpty>
            {step === "book" ? "No book found." : "No chapter found."}
          </CommandEmpty>

          {step === "book" && (
            <>
              <CommandGroup heading="Old Testament">
                {books
                  .filter((b) => OT_BOOKS.includes(b.name))
                  .map((book) => (
                    <CommandItem
                      key={book.name}
                      value={book.name}
                      onSelect={() => handleSelectBook(book.name)}
                    >
                      <BookOpenIcon className="text-muted-foreground" />
                      <span>{book.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {book.chapters} ch
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="New Testament">
                {books
                  .filter((b) => !OT_BOOKS.includes(b.name))
                  .map((book) => (
                    <CommandItem
                      key={book.name}
                      value={book.name}
                      onSelect={() => handleSelectBook(book.name)}
                    >
                      <BookOpenIcon className="text-muted-foreground" />
                      <span>{book.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {book.chapters} ch
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}

          {step === "chapter" && bookInfo && (
            <CommandGroup heading={selectedBook ?? ""}>
              {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map(
                (ch) => (
                  <CommandItem
                    key={ch}
                    value={`${selectedBook} ${ch}`}
                    onSelect={() => handleSelectChapter(ch)}
                  >
                    Chapter {ch}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
