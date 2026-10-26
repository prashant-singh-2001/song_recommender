import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.png";
import { isValidUrl } from "../api";

const SongCard = ({ song }) => (
  <Link
    to={`/song/${song.id}`}
    className="p-4 mb-4 rounded-xl hover:bg-gray-200 duration-200 flex items-center w-full"
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
      <p className="text-gray-600">By {song.artist}</p>
    </div>
  </Link>
);

export default SongCard;
