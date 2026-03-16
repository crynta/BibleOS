import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBibleAgent } from "@/lib/ai";
import { useReaderStore } from "@/stores/reader";
import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import {
  ArrowUpIcon,
  BookOpenIcon,
  KeyIcon,
  Loader2Icon,
  MessageSquareTextIcon,
  SquareIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

// ── Persistent transport (survives drawer open/close) ──────────────

let cachedTransport: { key: string; transport: DirectChatTransport } | null =
  null;

function getTransport(apiKey: string) {
  if (cachedTransport?.key === apiKey) return cachedTransport.transport;
  const transport = new DirectChatTransport({
    agent: createBibleAgent(apiKey),
  });
  cachedTransport = { key: apiKey, transport };
  return transport;
}

// ── Quick actions ──────────────────────────────────────────────────

type QuickAction = { label: string; prompt: string; icon: React.ReactNode };

function useQuickActions(): QuickAction[] {
  const { currentBook, currentChapter } = useReaderStore();
  const passage = `${currentBook} ${currentChapter}`;

  return [
    {
      label: "Explain this chapter",
      prompt: `Explain ${passage} — what is happening, who are the key figures, and what is the main message?`,
      icon: <BookOpenIcon className="size-3.5" />,
    },
    {
      label: "Historical context",
      prompt: `What is the historical and cultural context of ${passage}? What was happening in that world?`,
      icon: <BookOpenIcon className="size-3.5" />,
    },
    {
      label: "Key themes",
      prompt: `What are the key theological themes in ${passage} and how do they connect to the rest of Scripture?`,
      icon: <MessageSquareTextIcon className="size-3.5" />,
    },
    {
      label: "Apply to life",
      prompt: `How can the message of ${passage} be applied to everyday spiritual life today?`,
      icon: <MessageSquareTextIcon className="size-3.5" />,
    },
  ];
}

// ── Empty state ────────────────────────────────────────────────────

function ChatEmpty({ onSelect }: { onSelect: (prompt: string) => void }) {
  const quickActions = useQuickActions();

  return (
    <Empty className="mb-16 flex-1 border-none">
      <EmptyHeader>
        <EmptyMedia>
          <img src="/bibleos-logo.png" alt="BibleOS" className="size-12" />
        </EmptyMedia>
        <EmptyTitle className="text-base">BibleOS Assistant</EmptyTitle>
        <EmptyDescription>
          Ask anything about the passage you're reading — context, meaning,
          original languages, or how it connects to the rest of Scripture.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex flex-wrap justify-center gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onSelect(action.prompt)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </EmptyContent>
    </Empty>
  );
}

// ── Message bubble ─────────────────────────────────────────────────

function MessageBubble({
  msg,
  isStreaming,
}: {
  msg: {
    id: string;
    role: string;
    parts: Array<{ type: string; text?: string }>;
  };
  isStreaming: boolean;
}) {
  const isUser = msg.role === "user";

  const text = msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => (isUser ? p.text.replace(/^\[Context:.*?\]\n\n/, "") : p.text))
    .join("");

  if (!text) return null;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <Streamdown
        animated
        isAnimating={isStreaming}
        className="ai-message max-w-[85%] text-sm leading-relaxed"
      >
        {text}
      </Streamdown>
    </div>
  );
}

// ── API Key form ───────────────────────────────────────────────────

export function ApiKeyForm({
  onSave,
}: {
  onSave: (key: string) => Promise<void>;
}) {
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!key.trim()) return;
    setSaving(true);
    await onSave(key.trim());
    setSaving(false);
  };

  return (
    <Empty className="flex-1 border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KeyIcon />
        </EmptyMedia>
        <EmptyTitle>Connect to AI</EmptyTitle>
        <EmptyDescription>
          Enter your OpenAI API key. It's stored securely in the system
          keychain.
        </EmptyDescription>
      </EmptyHeader>
      <form className="flex w-full max-w-xs gap-2" onSubmit={handleSubmit}>
        <Input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
        />
        <Button type="submit" disabled={!key.trim() || saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </form>
    </Empty>
  );
}

// ── Chat body ──────────────────────────────────────────────────────

export function ChatBody({ apiKey }: { apiKey: string }) {
  const { currentBook, currentChapter } = useReaderStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: "bible-chat",
    transport: getTransport(apiKey),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      setInput("");
      void sendMessage({
        text: `[Context: User is reading ${currentBook} ${currentChapter}]\n\n${text}`,
      });
    },
    [currentBook, currentChapter, isLoading, sendMessage],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages / Empty */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        {messages.length === 0 ? (
          <ChatEmpty onSelect={send} />
        ) : (
          <div className="space-y-4 p-4 pb-2">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isStreaming={
                  status === "streaming" &&
                  i === messages.length - 1 &&
                  msg.role === "assistant"
                }
              />
            ))}
            {status === "submitted" && (
              <div className="flex justify-start pl-1">
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about this passage..."
            rows={1}
            className="max-h-28 min-h-8 flex-1 resize-none rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <div className="flex gap-1">
            {messages.length > 0 && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMessages([])}
              >
                <Trash2Icon />
              </Button>
            )}
            {isLoading ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => stop()}
              >
                <SquareIcon className="size-3" />
              </Button>
            ) : (
              <Button type="submit" size="icon-lg" disabled={!input.trim()}>
                <ArrowUpIcon />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
