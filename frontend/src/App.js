import { useState } from "react";
import "./App.css"; // Import styles for the App component
import SearchPage from "./pages/SearchPage";
import SongPage from "./pages/SongPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [song, setSong] = useState();
  const [recommend, setRecommend] = useState();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SearchPage SetSong={setSong} SetRecommend={setRecommend} />}
        />
        <Route
          path="/song"
          element={
            <SongPage
              Song={song}
              Recommend={recommend}
              SetSong={setSong}
              SetRecommend={setRecommend}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
