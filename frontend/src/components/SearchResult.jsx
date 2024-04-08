import React from "react";
import placeholder from "../assets/placeholder.png";
import { useNavigate } from "react-router-dom";
// Function to check if a URL starts with "http://" or "https://"
function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

const SearchResult = ({ data, SetSong, SetRecommend }) => {
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
    data &&
    Object.keys(data.artist).map((key) => (
      <div
        key={key} // Unique key for each result item
        className="p-4 mb-4 rounded-xl cursor-pointer hover:bg-gray-200 duration-200 flex items-center "
        style={{ width: "100%", maxWidth: "600px" }} // Adjust width as needed
        onClick={(e) => {
          fetchAndRecommend(data.song[key]);
        }}
      >
        <div className="w-1/3 p-1 ">
          <img
            className="rounded-full h-24 w-24 object-cover mx-auto"
            src={
              isValidUrl(data.img_url[key]) ? data.img_url[key] : placeholder
            }
            alt={data.song[key] + " by " + data.artist[key]} // Provide descriptive alt text
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
      } p-4 text-gray-900 w-1/2 rounded-xl`}
    >
      <div className="w-full flex flex-col justify-center items-center">
        {rows}
      </div>
    </div>
  );
};

export default SearchResult;
