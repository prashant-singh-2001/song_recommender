import React, { useState, useEffect } from "react";
import SongCard from "../components/SongCard";
import { browseSongs } from "../api";

const BrowsePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    browseSongs(50, controller.signal)
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError("Could not load songs. Please try again.");
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="mt-2 p-4 text-gray-900 rounded-xl">
      {loading && <p className="text-center text-gray-600">Loading…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
