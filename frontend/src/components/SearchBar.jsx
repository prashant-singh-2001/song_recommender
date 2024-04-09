import React, { useState, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ setRes }) => {
  const [input, setInput] = useState(""); // State variable to store the user's search input
  const [resp, setResp] = useState({ artist: [], song: [], text: [] }); // State variable to store the fetched search results (initially empty)

  // Function to fetch search data from the backend API
  const fetchData = useCallback(async (value) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      };

      const response = await fetch(
        "http://127.0.0.1:8000/search",
        requestOptions
      );
      const json = await response.json();
      setResp(json.result); // Update search results state with API response
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  // Function to handle changes in the search input field
  const handleChange = useCallback(
    (value) => {
      setInput(value);
      if (value === "") {
        // Clear search results when the input is empty
        setResp({ artist: [], song: [], text: [] });
        return;
      }
      fetchData(value);
    },
    [fetchData]
  );

  // Function to handle search button click
  const handleSearch = useCallback(() => {
    fetchData(input);
    setRes(resp); // Update search results state (potentially redundant)
  }, [fetchData, input, resp, setRes]);

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
          onClick={handleSearch}
        >
          <AiOutlineSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
