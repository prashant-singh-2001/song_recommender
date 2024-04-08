import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.png";

function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
const RecommendationComponent = ({ Recommend, SetSong, SetRecommend }) => {
  const navigate = useNavigate();

  const fetchSong = async (value) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/song",
        requestOptions
      );
      const json = await response.json();
      SetSong(json.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchRecommendation = async (value) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/search",
        requestOptions
      );
      const json = await response.json();
      SetRecommend(json.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchAndRecommend = async (data) => {
    await fetchSong(data);
    await fetchRecommendation(data);
    navigate("/song");
  };
  // Ensure data exists and has artist entries before rendering
  const rows =
    Recommend &&
    Object.keys(Recommend.artist).map((key) => (
      <div
        key={key} // Unique key for each result item
        className="p-4 mb-4 rounded-xl cursor-pointer hover:bg-gray-200 duration-200 flex items-center w-full"
        onClick={(e) => {
          fetchAndRecommend(Recommend.song[key]);
        }}
      >
        <div className="w-1/3 p-1 ">
          <img
            className="rounded-full h-24 w-24 object-cover mx-auto"
            src={
              isValidUrl(Recommend.img_url[key])
                ? Recommend.img_url[key]
                : placeholder
            }
            alt={Recommend.song[key] + " by " + Recommend.artist[key]} // Provide descriptive alt text
          />
        </div>
        <div className="w-2/3 p-4 text-center">
          <p className="text-lg font-semibold">{Recommend.song[key]}</p>
          <p className="text-gray-600 ">By {Recommend.artist[key]}</p>
        </div>
      </div>
    ));

  return (
    <div
      className={`mt-2 ${
        Recommend && Object.keys(Recommend.artist).length > 0
          ? "block"
          : "hidden"
      } p-4 text-gray-900  rounded-xl`}
    >
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 text-center ">
        {rows}
      </div>
    </div>
  );
};

export default RecommendationComponent;
