import React from "react";
import placeholder from "../assets/placeholder.png";
function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
const SongComponent = ({ Song }) => {
  const { artist, song, img_url } = { ...Song[0] };

  return (
    <>
      {Song && (
        <div className="w-full h-full flex p-2 justify-start items-center bg-rose-700  bg-opacity-40 rounded-lg">
          <div className="w-1/6 p-1">
            <img
              className=" max-h-48 max-w-48 object-cover rounded-lg"
              src={isValidUrl(img_url) ? img_url : placeholder}
              alt={song + " by " + artist} // Provide descriptive alt text
            />
          </div>
          <div className="w-2/3 p-4">
            <p className="text-5xl font-semibold">{song}</p>
            <p className="text-2xl text-gray-600 ">By {artist}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SongComponent;

// artist
// :
// "Foo Fighters"
// img_url
// :
// "https://lastfm.freetls.fastly.net/i/u/300x300/a3b076a45d944b508d4455556b96b5ad.png"
// song
// :
// "End Over End"
