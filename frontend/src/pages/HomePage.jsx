import React from "react";
import { Link } from "react-router-dom";

const buttonBase =
  "shadow-lg hover:shadow-md font-semibold px-6 py-3 duration-300 text-gray-900 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-white";

const HomePage = () => {
  const divStyle = {
    background: 'url("/hero-image.jpg")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  };

  return (
    <main
      style={divStyle}
      className="font-Raleway w-full min-h-screen bg-green-600 px-6 sm:pe-24 flex flex-col justify-center items-center sm:items-end select-none"
    >
      <h1 className="font-Croissant mb-4 text-center sm:text-right text-7xl sm:text-9xl lg:text-[10rem] leading-none">
        <span className="text-teal-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]">
          Lyric
        </span>
        <span className="text-orange-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]">
          Link
        </span>
      </h1>
      <h2 className="text-3xl sm:text-5xl font-bold font-Croissant text-center sm:text-right text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]">
        Your Personal Playlist Guide
      </h2>
      <div className="my-6 flex">
        <Link
          to="/search"
          className={`${buttonBase} hover:shadow-orange-300 rounded-s-2xl bg-blue-300`}
        >
          Find Your Jam
        </Link>
        <div className="w-4 bg-stone-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]"></div>
        <Link
          to="/browse"
          className={`${buttonBase} hover:shadow-sky-300 rounded-e-2xl bg-orange-300`}
        >
          Discover New Hits
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
