import { Discover } from "@/components/discover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { useApiKey } from "@/hooks/api-key";
import { useTheme } from "@/lib/theme-provider";
import { ReaderView } from "@/lib/types";
import { useChatStore } from "@/stores/chat";
import { useReaderStore } from "@/stores/reader";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  Zap,
} from "lucide-react";

export function Header() {
  const { prevChapter, nextChapter, readerView, changeReaderView } =
    useReaderStore();
  const { toggle: toggleChat } = useChatStore();
  const { theme, setTheme } = useTheme();
  const { clear: clearApiKey } = useApiKey();

  return (
    <header
      data-tauri-drag-region
      className="flex h-12 shrink-0 items-center justify-center border-b bg-zinc-50 px-4 dark:bg-zinc-900"
    >
      {/* Left — navigation */}
      <div className="absolute left-[5.5px] top-6.5 flex items-center">
        <Button
          variant="secondary"
          size="icon-xs"
          className="mr-0.5 h-4.5 w-8 active:scale-90"
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

      {/* Center — search trigger */}
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
        <span className="mr-1">Search...</span>
        <Kbd>⌘K</Kbd>
      </Button>

      {/* Right — AI + settings */}
      <div className="absolute right-2 flex items-center gap-1">
        <Discover />
        <Button
          variant="ghost"
          className="transition-opacity hover:opacity-80 cursor-pointer"
          size="icon-xs"
          onClick={toggleChat}
        >
          <Zap className="size-4.5 text-foreground/85" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="cursor-pointer">
              <SettingsIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as typeof theme)}
            >
              <DropdownMenuRadioItem value="light">
                <SunIcon />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <MoonIcon />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <MonitorIcon />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Reader View</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={readerView}
                onValueChange={(value) =>
                  void changeReaderView(value as ReaderView)
                }
              >
                <DropdownMenuRadioItem value="default">
                  Default
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="stacked">
                  Stacked
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>API Key</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => void clearApiKey()}>
              Reset API key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
