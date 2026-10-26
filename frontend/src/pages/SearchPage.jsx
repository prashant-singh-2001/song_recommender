import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SongCard from "../components/SongCard";

const SearchPage = () => {
  const [results, setResults] = useState(null); // null = nothing searched yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <p className="my-8 font-semibold text-5xl">Search</p>
      <SearchBar
        onResults={setResults}
        onLoading={setLoading}
        onError={setError}
      />
      {loading && <p className="mt-6 text-gray-600">Searching…</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}
      {!loading && !error && results && results.length === 0 && (
        <p className="mt-6 text-gray-600">No songs found.</p>
      )}
      {results && results.length > 0 && (
        <div className="mt-2 p-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 text-center">
          {results.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
