import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SongCard from "../components/SongCard";
import Status from "../components/Status";

const SearchPage = () => {
  const [results, setResults] = useState(null); // null = nothing searched yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="my-8 font-semibold text-4xl sm:text-5xl">Search</h1>
      <SearchBar
        onResults={setResults}
        onLoading={setLoading}
        onError={setError}
      />
      <div aria-live="polite" className="w-full">
        <Status
          loading={loading}
          loadingText="Searching…"
          error={error}
          empty={!loading && !error && results !== null && results.length === 0}
          emptyText="No songs found."
        />
      </div>
      {results && results.length > 0 && (
        <div className="mt-2 p-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 text-center">
          {results.map((song) => (
            <SongCard key={song.id} song={song} snippet={song.snippet} />
          ))}
        </div>
      )}
    </main>
  );
};

export default SearchPage;
