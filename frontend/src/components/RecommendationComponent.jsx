import React from "react";
import SongCard from "./SongCard";

const RecommendationComponent = ({ Recommend }) => {
  if (!Recommend || Recommend.length === 0) return null;
  return (
    <section className="mt-4 p-4" aria-labelledby="similar-heading">
      <h2 id="similar-heading" className="text-2xl font-semibold mb-2">
        Similar songs
      </h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 text-center">
        {Recommend.map((song) => (
          <SongCard key={song.id} song={song} score={song.score} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationComponent;
