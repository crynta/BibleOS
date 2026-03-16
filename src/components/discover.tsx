import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDiscover } from "@/lib/discover";
import type { SearchResult } from "@/lib/types";
import { useReaderStore } from "@/stores/reader";
import {
  BookSearch,
  CloudRainIcon,
  FlameIcon,
  HeartIcon,
  HelpCircleIcon,
  LoaderCircle,
  SearchIcon,
  ShieldIcon,
  SmileIcon,
  SparkleIcon,
  SunIcon,
  SwordsIcon,
  WindIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Kbd } from "./ui/kbd";

const TOPICS = [
  { label: "Love", icon: HeartIcon },
  { label: "Hope", icon: SunIcon },
  { label: "Faith", icon: SparkleIcon },
  { label: "Grace", icon: WindIcon },
  { label: "Joy", icon: SmileIcon },
  { label: "Peace", icon: ShieldIcon },
  { label: "Courage", icon: FlameIcon },
  { label: "Temptation", icon: SwordsIcon },
  { label: "Doubt", icon: HelpCircleIcon },
] as const;

export function Discover() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { loading, results, search, reset } = useDiscover();
  const { goTo } = useReaderStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Cmd+D
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setHasSearched(false);
      reset();
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    // Clearing the input returns to topics view
    if (!value.trim()) {
      setHasSearched(false);
      reset();
    }
  };

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    await search(query);
  };

  const handleTopicClick = async (topic: string) => {
    setQuery(topic);
    setHasSearched(true);
    await search(topic);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    void goTo(result.book, result.chapter);
    handleOpenChange(false);
  };

  const showTopics = !hasSearched && !loading;
  const showResults = hasSearched && results.length > 0;
  const showEmpty = hasSearched && !loading && results.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          <BookSearch className="size-4.5 text-foreground/85" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg gap-0 p-0" aria-describedby={undefined}>
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-base flex items-center gap-1.5">
            <Kbd className="scale-95">⌘D</Kbd>
            Discover
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 border-b px-4 py-3">
          <div className="relative flex-1">
            {loading ? (
              <LoaderCircle className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            ) : (
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search scriptures..."
              className="pr-8 pl-8.5"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={loading || !query.trim()}
            className="shrink-0"
          >
            <SearchIcon className="size-4" />
          </Button>
        </form>

        {/* Topics */}
        {showTopics && (
          <div className="px-5 py-4">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Explore by topic
            </p>
            <div className="grid grid-cols-3 gap-2 px-8">
              {TOPICS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => void handleTopicClick(label.toLowerCase())}
                  className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2 py-3 text-center transition-colors hover:border-border hover:bg-muted"
                >
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading shimmer */}
        {loading && (
          <div className="space-y-2 px-3 py-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg px-3 py-2.5">
                <div className="mb-1.5 h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="max-h-[52vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="space-y-0.5 px-3 py-3">
              <p className="px-2 pb-1 text-xs text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-foreground/80">
                  &ldquo;{query}&rdquo;
                </span>
              </p>
              {results.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleResultClick(result)}
                  className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                >
                  <p className="mb-0.5 text-xs font-semibold text-foreground/60">
                    {result.book}{" "}
                    <span className="font-mono">
                      {result.chapter}:{result.verse}
                    </span>
                  </p>
                  <p className="line-clamp-2 text-sm leading-relaxed text-foreground/85">
                    {result.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {showEmpty && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <CloudRainIcon className="size-7 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
