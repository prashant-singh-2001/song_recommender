import React from "react";
import SongCard from "../components/SongCard";
import Status from "../components/Status";
import useFavorites from "../hooks/useFavorites";

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <main className="mt-2 p-4">
      <h1 className="text-3xl sm:text-4xl font-semibold">Favourites</h1>
      <Status
        empty={favorites.length === 0}
        emptyText="No favourites yet. Tap the heart on any song to save it here."
      />
      <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {favorites.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </main>
  );
};

export default FavoritesPage;
