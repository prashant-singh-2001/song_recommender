import "./App.css"; // Import styles for the App component
import SearchPage from "./pages/SearchPage";
import SongPage from "./pages/SongPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <div className="min-w-full min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/song/:id" element={<SongPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
