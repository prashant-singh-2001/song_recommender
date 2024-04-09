import React, { useState, useEffect } from "react";
import placeholder from "../assets/placeholder.png";
import { useNavigate } from "react-router-dom";

function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
const BrowsePage = ({ SetSong, SetRecommend }) => {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("http://localhost:8000/browse");
      const data = await response.json();
      if (data.success) {
        setSongs(data.result);
      } else {
        console.error("Error:", data.error_message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
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
  const renderSongs = () =>
    songs.map((song, index) => (
      <div
        key={index}
        className="p-4 mb-4 rounded-xl cursor-pointer hover:bg-gray-200 duration-200 flex items-center w-full"
        onClick={(e) => {
          fetchAndRecommend(song.song);
        }}
      >
        <div className="w-1/3 p-1">
          <img
            className="rounded-full h-24 w-24 object-cover mx-auto"
            src={isValidUrl(song.img_url) ? song.img_url : placeholder}
            alt={`${song.song} by ${song.artist}`}
          />
        </div>
        <div className="w-2/3 p-4 text-center">
          <p className="text-lg font-semibold">{song.song}</p>
          <p className="text-gray-600">By {song.artist}</p>
        </div>
      </div>
    ));

  return (
    <div className="mt-2 p-4 text-gray-900 rounded-xl">
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {renderSongs()}
      </div>
    </div>
  );
};

export default BrowsePage;
