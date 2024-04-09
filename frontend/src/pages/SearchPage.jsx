import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";

const SearchPage = ({ SetSong, SetRecommend }) => {
  // State variable to store search results (artist, song, text)
  const [res, setRes] = useState({
    artist: [],
    song: [],
    text: [],
  });
  return (
    <div className=" flex min-w-screen min-h-screen flex-col items-center ">
      <p className="my-8 font-semibold text-5xl">Search</p>
      <SearchBar setRes={setRes} /> {/* Pass setRes function to SearchBar */}
      <SearchResult
        data={res}
        SetSong={SetSong}
        SetRecommend={SetRecommend}
      />{" "}
      {/* Pass search results (res) to SearchResult */}
    </div>
  );
};

export default SearchPage;
