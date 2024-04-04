import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  return (
    <form className="w-1/2 relative ">
      <div className="relative">
        <input
          type="search"
          placeholder="Type Here"
          className="w-full p-4 rounded-full bg-slate-300 "
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-3 bg-slate-200 duration-200 text-2xl hover:bg-slate-100 rounded-full">
          <AiOutlineSearch />
        </button>
      </div>
      <div className="absolute top-20 bg-slate-300 p-4 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
        
      </div>
    </form>
  );
};

export default SearchBar;
