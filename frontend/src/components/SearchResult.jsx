import React from "react";

const SearchResult = ({ data }) => {
  const apiKey = "a5779dc2b803199332cccb4acd19e8a9";
  const rows = Object.keys(data.artist).map((key) => (
    <div
      key={key}
      className="bg-gray-200 border p-4 mb-4 rounded-xl cursor-pointer hover:bg-gray-50 duration-200"
    >
      <p className="text-lg font-semibold">{data.song[key]}</p>
      <p className="text-gray-600">{data.artist[key]}</p>
      <img
        src={`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(
          data.artist[key]
        )}&track=${encodeURIComponent(data.song[key])}&format=json`}
        alt=""
      />
    </div>
  ));

  return (
    <div
      className={`mt-2 ${
        Object.keys(data.artist).length > 0 ? "block" : "hidden"
      }  p-4 text-gray-900 w-1/2 rounded-xl`}
    >
      <div className="w-full">{rows}</div>
    </div>
  );
};

export default SearchResult;
