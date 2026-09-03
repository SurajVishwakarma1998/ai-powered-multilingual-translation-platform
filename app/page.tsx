"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Hindi");

  const handleTranslate = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const res = await fetch("/api/translate-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
        }),
      });

      const data = await res.json();
      setTranslated(data.translated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translated);
    setTranslated(text);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-100 dark:bg-black p-6">
      <main className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 space-y-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center">
          🌍 AI Translator
        </h1>

        {/* Language Selection */}
        <div className="flex items-center justify-between gap-4">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="p-2 border rounded-lg w-full"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>French</option>
          </select>

          <button
            onClick={swapLanguages}
            className="px-4 py-2 bg-blue-400 rounded-lg hover:bg-blue-500"
          >
            ⇄
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-2 border rounded-lg w-full"
          >
            <option>Hindi</option>
            <option>English</option>
            <option>French</option>
          </select>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="w-full h-40 p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Output */}
          <div className="w-full h-40 p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-800">
            {loading ? (
              <p className="text-gray-400">Translating...</p>
            ) : translated ? (
              <p>{translated}</p>
            ) : (
              <p className="text-gray-400">Translation will appear here</p>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleTranslate}
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </main>
    </div>
  );
}