import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";

function App() {
  const [res, setRes] = useState({
    artist: [],
    song: [],
    text: [],
  });
  return (
    <div className="m-8 flex min-w-screen min-h-screen flex-col items-center ">
      <p className="my-4 font-semibold text-6xl font-Croissant">LyricLink</p>
      <p className="my-4  font-semibold text-2xl">
        Song recommendations by Linked Lyrics
      </p>
      <SearchBar setRes={setRes} />
      <SearchResult data={res} />
    </div>
  );
}

export default App;
