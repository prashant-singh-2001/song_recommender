import { useState } from "react";
import "./App.css"; // Import styles for the App component
import SearchBar from "./components/SearchBar"; // Import SearchBar component
import SearchResult from "./components/SearchResult"; // Import SearchResult component

function App() {
  // State variable to store search results (artist, song, text)
  const [res, setRes] = useState({
    artist: [],
    song: [],
    text: [],
  });

  return (
    <div className="m-8 flex min-w-screen min-h-screen flex-col items-center ">
      <p className="my-4 font-semibold text-6xl font-Croissant">LyricLink</p>
      <p className="my-4  font-semibold text-2xl">
        {/* Title for the application */}
        Song recommendations by Linked Lyrics
      </p>
      <SearchBar setRes={setRes} /> {/* Pass setRes function to SearchBar */}
      <SearchResult data={res} />{" "}
      {/* Pass search results (res) to SearchResult */}
    </div>
  );
}

export default App;
