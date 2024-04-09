import { useState } from "react";
import "./App.css"; // Import styles for the App component
import SearchPage from "./pages/SearchPage";
import SongPage from "./pages/SongPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  const [song, setSong] = useState();
  const [recommend, setRecommend] = useState();
  return (
    <div className="min-w-full min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/browse"
            element={
              <BrowsePage SetSong={setSong} SetRecommend={setRecommend} />
            }
          />
          <Route
            path="/search"
            element={
              <SearchPage SetSong={setSong} SetRecommend={setRecommend} />
            }
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
    </div>
  );
}

export default App;
