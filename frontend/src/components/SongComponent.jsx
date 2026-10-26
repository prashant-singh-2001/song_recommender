import React from "react";
import placeholder from "../assets/placeholder.png";
import { isValidUrl } from "../api";

const SongComponent = ({ Song }) => {
  const { artist, song, img_url } = { ...Song };

  return (
    <>
      {Song && (
        <div className="w-full flex p-2 justify-start items-center bg-orange-200 rounded-lg">
          <div className="w-1/6 p-1">
            <img
              className="max-h-48 max-w-48 object-cover rounded-lg"
              src={isValidUrl(img_url) ? img_url : placeholder}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
              alt={song + " by " + artist}
            />
          </div>
          <div className="w-2/3 p-4">
            <p className="text-5xl font-semibold">{song}</p>
            <p className="text-2xl text-gray-600">By {artist}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SongComponent;
