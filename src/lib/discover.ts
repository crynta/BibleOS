import { useState } from "react";
import { getDb } from "./db";
import type { SearchResult } from "./types";

export function useDiscover() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  async function search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    setLoading(true);
    try {
      const db = await getDb();

      // Strip FTS5 special characters to avoid parse errors
      const ftsQuery = query
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.replace(/["'*^(),:.-]/g, ""))
        .filter(Boolean)
        .join(" ");

      if (!ftsQuery) return [];

      const rows = await db.select<SearchResult[]>(
        `SELECT book, chapter, verse, text
         FROM verses_fts
         WHERE verses_fts MATCH ?
         ORDER BY rank
         LIMIT 25`,
        [ftsQuery],
      );
      setResults(rows);
      return rows;
    } catch {
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResults([]);
  }

  return { loading, results, search, reset };
}
