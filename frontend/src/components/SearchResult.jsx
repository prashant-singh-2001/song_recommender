import React from "react";

const SearchResult = ({ res }) => {
  return (
    <div
      className={
        res.length === 0
          ? "hidden "
          : "block " +
            "mt-2 bg-slate-300 p-4 text-white w-full rounded-xl  flex flex-col gap-2"
      }
    >
      {res.map((item, index) => (
        <div key={index}>
          <h2>{item.artist}</h2>
          <h3>{item.song}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
