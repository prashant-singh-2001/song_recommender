import React from "react";
import { FiHeart, FiExternalLink } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import placeholder from "../assets/placeholder.png";
import { isValidUrl, spotifyUrl, youtubeUrl } from "../api";
import useFavorites from "../hooks/useFavorites";

const linkClass =
  "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 hover:bg-white dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

const SongComponent = ({ Song }) => {
  const { isFavorite, toggle } = useFavorites();
  if (!Song) return null;

  const { artist, song, img_url } = Song;
  const favorite = isFavorite(Song.id);

  return (
    <div className="w-full flex flex-col sm:flex-row p-4 gap-4 items-center bg-orange-200 dark:bg-slate-800 rounded-lg">
      <img
        className="h-40 w-40 sm:h-48 sm:w-48 object-cover rounded-lg"
        src={isValidUrl(img_url) ? img_url : placeholder}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = placeholder;
        }}
        alt={`${song} by ${artist}`}
      />
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-semibold">{song}</h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">By {artist}</p>
        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
          <button
            type="button"
            onClick={() => toggle(Song)}
            aria-pressed={favorite}
            className={linkClass}
          >
            {favorite ? <FaHeart className="text-red-500" /> : <FiHeart />}
            {favorite ? "Favourited" : "Favourite"}
          </button>
          <a href={spotifyUrl(Song)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Spotify <FiExternalLink aria-hidden="true" />
          </a>
          <a href={youtubeUrl(Song)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            YouTube <FiExternalLink aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SongComponent;
