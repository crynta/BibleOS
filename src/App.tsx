import { BookSelector } from "@/components/book-selector";
import { Header } from "@/components/header";
import { Reader } from "@/components/reader";
import { useReaderStore } from "@/stores/reader";
import { useEffect } from "react";
import "./App.css";

export default function App() {
  const init = useReaderStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        <Reader />
      </main>

      <BookSelector />
      <div className="fixed w-full h-10 bg-linear-to-b from-transparent to-background/90 bottom-0" />
    </div>
  );
}
