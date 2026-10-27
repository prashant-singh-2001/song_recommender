import React, { useState, useEffect, useRef, useCallback } from "react";
import SongCard from "../components/SongCard";
import Status from "../components/Status";
import { browseSongs } from "../api";

const PAGE_SIZE = 24;
const hasObserver = typeof IntersectionObserver !== "undefined";

const BrowsePage = () => {
  const [songs, setSongs] = useState([]);
  const [seed, setSeed] = useState(null);
  const [nextOffset, setNextOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlight = useRef(null);
  const sentinel = useRef(null);

  // Fetch one page. `reset` starts a fresh random order (Shuffle / first load).
  const loadPage = useCallback(
    async (reset) => {
      if (inFlight.current && !reset) return;
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;
      setLoading(true);
      setError(null);
      try {
        const page = await browseSongs(
          {
            limit: PAGE_SIZE,
            offset: reset ? 0 : nextOffset,
            seed: reset ? undefined : seed,
          },
          controller.signal
        );
        setSongs((prev) => (reset ? page.items : [...prev, ...page.items]));
        setSeed(page.seed);
        setNextOffset(page.next_offset);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError("Could not load songs. Please try again.");
      }
      inFlight.current = null;
      setLoading(false);
    },
    [nextOffset, seed]
  );

  useEffect(() => {
    loadPage(true);
    return () => inFlight.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the next page when the sentinel scrolls into view.
  useEffect(() => {
    if (!hasObserver || !sentinel.current || nextOffset === null || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadPage(false);
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadPage, loading, nextOffset, error]);

  return (
    <main className="mt-2 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-semibold">Browse</h1>
        <button
          type="button"
          onClick={() => loadPage(true)}
          className="px-4 py-2 rounded-full bg-orange-300 hover:bg-orange-200 text-gray-900 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          Shuffle
        </button>
      </div>
      <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
      <Status
        loading={loading}
        error={error}
        onRetry={() => loadPage(songs.length === 0)}
      />
      <div ref={sentinel} aria-hidden="true" className="h-1" />
      {!hasObserver && nextOffset !== null && !loading && (
        <div className="text-center my-4">
          <button
            type="button"
            onClick={() => loadPage(false)}
            className="px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-700"
          >
            Load more
          </button>
        </div>
      )}
    </main>
  );
};

export default BrowsePage;
