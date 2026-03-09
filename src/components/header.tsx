import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useReaderStore } from "@/stores/reader";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  Settings,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle";

export function Header() {
  const { prevChapter, nextChapter } = useReaderStore();

  return (
    <header
      data-tauri-drag-region
      className="flex h-12 shrink-0 items-center justify-center bg-zinc-50 dark:bg-zinc-900 border-b mb-1 px-4 "
    >
      {/* Left — macOS traffic lights offset */}
      <div className="flex left-[5.5px] top-6.5 absolute items-center">
        <Button
          variant="secondary"
          size="icon-xs"
          className="h-4.5 w-8 mr-0.5 active:scale-90"
          onClick={() => void prevChapter()}
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          variant="secondary"
          size="icon-xs"
          className="h-4.5 w-8 active:scale-90"
          onClick={() => void nextChapter()}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* Center — current passage as a clickable search trigger */}
      <Button
        onClick={() =>
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true }),
          )
        }
        variant="ghost"
        size="lg"
        className="gap-1.5 px-3 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <SearchIcon className="size-4" />
        <span className="mr-1">
          Search...
          {/* {currentBook} {currentChapter} */}
        </span>
        <Kbd>⌘K</Kbd>
      </Button>

      {/* Right — actions */}
      <div className="flex items-center absolute right-2 justify-end gap-1">
        <ModeToggle />
        <Button size="icon" variant="outline">
          <Settings />
        </Button>
      </div>
    </header>
  );
}
