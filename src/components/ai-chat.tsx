import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useApiKey } from "@/hooks/api-key";
import { useChatStore } from "@/stores/chat";
import { ApiKeyForm, ChatBody } from "./chat-body";

export function AIChatDrawer() {
  const { open, setOpen } = useChatStore();
  const { apiKey, save, loading } = useApiKey();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        className="max-h-[80vh] min-h-[60vh]"
        aria-describedby={undefined}
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>BibleOS Assistant</DrawerTitle>
        </DrawerHeader>
        {!loading &&
          (apiKey ? (
            <ChatBody apiKey={apiKey} />
          ) : (
            <ApiKeyForm onSave={save} />
          ))}
      </DrawerContent>
    </Drawer>
  );
}
