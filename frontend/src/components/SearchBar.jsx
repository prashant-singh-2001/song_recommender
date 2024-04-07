import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ setRes }) => {
  const [input, setInput] = useState("");
  const [resp, setResp] = useState();
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
      setResp(json.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (value) => {
    if (value === "") {
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
          onClick={(e) => {
            handleChange(input);
            setRes(resp);
          }}
        >
          <AiOutlineSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
