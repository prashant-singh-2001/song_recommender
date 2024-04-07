import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ setRes }) => {
  // State variable to store the user's search input
  const [input, setInput] = useState("");

  // State variable to store the fetched search results (initially empty)
  const [resp, setResp] = useState();

  // Function to fetch search data from the backend API
  const fetchData = async (value) => {
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
      setResp(json.result); // Update search results state with API response
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle changes in the search input field
  const handleChange = (value) => {
    if (value === "") {
      // Clear search results when the input is empty
      setResp({
        artist: [],
        song: [],
        text: [],
      });
      return;
    }
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="w-1/2 relative ">
      <div className="relative">
        <input
          type="search"
          placeholder="Type Here"
          className="w-full p-4 rounded-full bg-slate-300"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button
          className="absolute right-1 top-1/2 -translate-y-1/2 p-3 bg-slate-200 duration-200 text-2xl hover:bg-slate-100 rounded-full"
          onClick={() => {
            handleChange(input); // Trigger search on button click
            setRes(resp); // Update search results state (potentially redundant)
          }}
        >
          <AiOutlineSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
