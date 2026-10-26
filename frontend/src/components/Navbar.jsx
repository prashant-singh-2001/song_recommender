import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import useTheme from "../hooks/useTheme";

const linkClass = ({ isActive }) =>
  `mr-4 transition duration-200 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded ${
    isActive ? "text-white font-semibold" : "text-gray-300"
  }`;

export default function Navbar() {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  // The landing page has its own hero layout.
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-10 bg-gray-800 text-white p-4 flex justify-between items-center"
    >
      <Link
        to="/"
        className="text-xl font-bold font-Croissant outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
      >
        LyricLink
      </Link>

      <div className="flex items-center">
        <NavLink to="/search" className={linkClass}>
          Search
        </NavLink>
        <NavLink to="/browse" className={linkClass}>
          Browse
        </NavLink>
        <NavLink to="/favorites" className={linkClass}>
          Favourites
        </NavLink>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
}
