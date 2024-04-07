import React from "react";
import placeholder from "./placeholder.png";
function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
const SearchResult = ({ data }) => {
  const rows =
    data &&
    Object.keys(data.artist).map((key) => (
      <div
        key={key}
        className="p-4 mb-4 rounded-xl cursor-pointer hover:bg-gray-200 duration-200 flex items-center "
        style={{ width: "100%", maxWidth: "600px" }} // Adjust the width as needed
      >
        <div className="w-1/3 p-1 ">
          <img
            className="rounded-full h-24 w-24 object-cover mx-auto"
            src={
              isValidUrl(data.img_url[key]) ? data.img_url[key] : placeholder
            }
            alt={data.song[key] + " by  " + data.artist[key]}
          />
        </div>
        <div className="w-2/3 p-4 text-center">
          <p className="text-lg font-semibold">{data.song[key]}</p>
          <p className="text-gray-600 ">By {data.artist[key]}</p>
        </div>
      </div>
    ));

  return (
    <div
      className={`mt-2 ${
        data && Object.keys(data.artist).length > 0 ? "block" : "hidden"
      }  p-4 text-gray-900 w-1/2 rounded-xl`}
    >
      <div className="w-full flex flex-col justify-center items-center">
        {rows}
      </div>
    </div>
  );
};

export default SearchResult;
