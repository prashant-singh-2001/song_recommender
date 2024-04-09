import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Conditionally render the navbar based on the route
  if (location.pathname === "/") {
    return null; // If the route is "/", return null to hide the navbar
  }

  return (
    <nav
      className={`bg-gray-800 text-white p-4 flex justify-between items-center  transition duration-1000  ease-in-out ${
        isSticky ? "fixed top-0 left-0 w-full z-10" : ""
      }`}
    >
      {/* Organization name */}
      <Link to="/" className="text-xl font-bold font-Croissant">
        LyricLink
      </Link>

      <div>
        <Link
          to="/search"
          className="text-gray-300 hover:text-white mr-4 transition duration-200"
        >
          Search
        </Link>
        <Link
          to="/browse"
          className="text-gray-300 hover:text-white transition duration-200"
        >
          Browse
        </Link>
      </div>
    </nav>
  );
}
