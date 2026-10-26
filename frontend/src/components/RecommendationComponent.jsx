import React from "react";
import SongCard from "./SongCard";

const RecommendationComponent = ({ Recommend }) => (
  <div
    className={`mt-2 ${
      Recommend && Recommend.length > 0 ? "block" : "hidden"
    } p-4 text-gray-900 rounded-xl`}
  >
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 text-center">
      {Recommend &&
        Recommend.map((song) => <SongCard key={song.id} song={song} />)}
    </div>
  </div>
);

export default RecommendationComponent;
