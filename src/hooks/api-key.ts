import { load } from "@tauri-apps/plugin-store";
import { useCallback, useEffect, useState } from "react";

const KEY = "openai-api-key";

async function getStore() {
  return load("settings.json");
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStore()
      .then((store) => store.get<string>(KEY))
      .then((key) => setApiKey(key ?? null))
      .catch(() => setApiKey(null))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (key: string) => {
    const store = await getStore();
    await store.set(KEY, key);
    setApiKey(key);
  }, []);

  const clear = useCallback(async () => {
    const store = await getStore();
    await store.delete(KEY);
    setApiKey(null);
  }, []);

  return { apiKey, save, clear, loading };
}
