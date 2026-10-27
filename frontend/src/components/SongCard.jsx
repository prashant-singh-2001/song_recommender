import React from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import placeholder from "../assets/placeholder.png";
import { isValidUrl } from "../api";
import useFavorites from "../hooks/useFavorites";

const SongCard = ({ song, snippet, score }) => {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(song.id);

  return (
    <div className="relative mb-4">
      <Link
        to={`/song/${song.id}`}
        className="p-4 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-800 duration-200 flex items-center w-full outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <div className="w-1/3 p-1">
          <img
            className="rounded-full h-24 w-24 object-cover mx-auto"
            src={isValidUrl(song.img_url) ? song.img_url : placeholder}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholder;
            }}
            alt={`${song.song} by ${song.artist}`}
          />
        </div>
        <div className="w-2/3 p-4 text-center">
          <p className="text-lg font-semibold">{song.song}</p>
          <p className="text-gray-600 dark:text-gray-300">By {song.artist}</p>
          {typeof score === "number" && (
            <p className="mt-1 text-sm font-medium text-orange-600 dark:text-orange-300">
              {Math.round(score * 100)}% match
            </p>
          )}
          {snippet && (
            <p className="mt-1 text-sm italic text-gray-500 dark:text-gray-400 line-clamp-3">
              {snippet}
            </p>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle(song)}
        aria-pressed={favorite}
        aria-label={`${favorite ? "Remove" : "Add"} ${song.song} ${favorite ? "from" : "to"} favourites`}
        className="absolute top-2 right-2 p-2 rounded-full text-red-500 hover:bg-gray-200 dark:hover:bg-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        {favorite ? <FaHeart /> : <FiHeart />}
      </button>
    </div>
  );
};

export default SongCard;
