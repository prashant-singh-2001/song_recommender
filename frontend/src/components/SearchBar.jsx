import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { searchSongs } from "../api";

const DEBOUNCE_MS = 300;

const SearchBar = ({ onResults, onLoading, onError }) => {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");

  // Search shortly after typing stops; aborting the previous request keeps a
  // stale response from overwriting newer results.
  useEffect(() => {
    const q = input.trim();
    if (q.length < 2) {
      onResults(null);
      onLoading(false);
      onError(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(
      async () => {
        onLoading(true);
        onError(null);
        try {
          onResults(await searchSongs(q, controller.signal));
          onLoading(false);
        } catch (error) {
          if (error.name === "AbortError") return;
          onError("Could not reach the server. Please try again.");
          onLoading(false);
        }
      },
      submitted === q ? 0 : DEBOUNCE_MS
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input, submitted, onResults, onLoading, onError]);

  // Enter or the icon searches immediately instead of waiting for the debounce.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(input.trim());
  };

  return (
    <form className="w-full max-w-xl px-4 relative" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="search"
          aria-label="Search songs, artists or lyrics"
          placeholder="Search songs, artists or lyrics"
          className="w-full p-4 rounded-full bg-slate-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-3 bg-slate-200 duration-200 text-2xl hover:bg-slate-100 rounded-full"
        >
          <AiOutlineSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
