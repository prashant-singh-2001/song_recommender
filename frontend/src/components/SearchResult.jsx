import React from "react";
import placeholder from "../assets/placeholder.png";
import { useNavigate } from "react-router-dom";

function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

const SearchResult = ({ data, SetSong, SetRecommend }) => {
  const navigate = useNavigate();

  const fetchApiData = async (value, url, setter) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      setter(json.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAndRecommend = async (value) => {
    await fetchApiData(value, "http://127.0.0.1:8000/song", SetSong);
    await fetchApiData(value, "http://127.0.0.1:8000/search", SetRecommend);
    navigate("/song");
  };

  const renderRows = () =>
    data &&
    Object.keys(data.artist).map((key) => (
      <div
        key={key}
        className="p-4 mb-4 rounded-xl cursor-pointer hover:bg-gray-200 duration-200 flex items-center"
        style={{ width: "100%", maxWidth: "600px" }}
        onClick={() => fetchAndRecommend(data.song[key])}
      >
        <div className="w-1/3 p-1">
          <img
            className="rounded-full h-24 w-24 object-cover mx-auto"
            src={
              isValidUrl(data.img_url[key]) ? data.img_url[key] : placeholder
            }
            alt={`${data.song[key]} by ${data.artist[key]}`}
          />
        </div>
        <div className="w-2/3 p-4 text-center">
          <p className="text-lg font-semibold">{data.song[key]}</p>
          <p className="text-gray-600">By {data.artist[key]}</p>
        </div>
      </div>
    ));

  return (
    <div
      className={`mt-2 ${
        data && Object.keys(data.artist).length > 0 ? "block" : "hidden"
      } p-4 text-gray-900 rounded-xl`}
    >
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 text-center">
        {renderRows()}
      </div>
    </div>
  );
};

export default SearchResult;
