import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";

function App() {
  const [res, setRes] = useState([]);
  return (
    <div className="m-8 flex min-w-screen min-h-screen flex-col justify-center items-center ">
      <SearchBar setRes={setRes} />
      <SearchResult res={res} />
    </div>
  );
}

export default App;
