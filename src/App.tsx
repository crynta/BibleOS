import { useState } from "react";
import "./App.css";
import Genesis from "./books/Genesis.json";

function App() {
  const name = Genesis.book;
  const [currentChapter, setCurrentChapter] = useState(1);

  const nextChapter = () => {
    setCurrentChapter(currentChapter + 1);
  };

  const prevChapter = () => {
    if (currentChapter > 1) setCurrentChapter(currentChapter - 1);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center justify-center border-b border-neutral-700 sticky top-0 z-10">
        <div className="flex items-center gap-4 text-sm">
          <span
            className="opacity-80 hover:opacity-100 cursor-pointer select-none"
            onClick={prevChapter}
          >
            ←
          </span>

          <h1 className="text-lg font-semibold tracking-wide">
            {name} {currentChapter}
          </h1>

          <span
            className="opacity-80 hover:opacity-100 cursor-pointer select-none"
            onClick={nextChapter}
          >
            →
          </span>
        </div>
      </header>

      {/* Reader */}
      <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="max-w-2xl mx-auto py-10 px-6 space-y-4 leading-relaxed text-[17px]">
          {Genesis.chapters[currentChapter - 1].verses.map((verse) => (
            <div
              key={verse.verse}
              className="flex gap-3 group hover:bg-neutral-700/40 rounded-md px-2 py-1 transition"
            >
              <span className="font-mono text-neutral-500 text-sm mt-0.5">
                {verse.verse}
              </span>

              <p className="text-neutral-200">{verse.text}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom bar */}
      <footer className="h-14 border-t border-neutral-700 flex items-center justify-center bg-neutral-800/75">
        <div className="flex gap-6 text-sm text-neutral-400">
          <button className="hover:text-white transition">Explain</button>

          <button className="hover:text-white transition">Highlight</button>

          <button className="hover:text-white transition">Notes</button>
        </div>
      </footer>
    </div>
  );
}

export default App;
