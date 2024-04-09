import React from "react";
import { Link } from "react-router-dom";
const HomePage = () => {
  const divStyle = {
    background: 'url("./hero-image.jpg")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    minHeight: "100vh",
  };

  return (
    <div
      style={divStyle}
      className="font-Raleway bg-neutral w-full h-screen bg-green-600 pe-24 flex flex-col justify-center items-end select-none"
    >
      <div className="container flex flex-col justify-center items-end ">
        <h1
          className="font-Croissant mb-4 select-none text-accent text-sky-600"
          style={{ fontSize: 160 }}
        >
          LyricLink
        </h1>
      </div>
      <div className="w-10/12 text-center text-neutral flex flex-col justify-center items-end">
        <h1 className="text-5xl font-bold font-Lobster select-none">
          Your Personal Playlist Guide
        </h1>
        <div>
          <button className="btn btn-secondary btn-lg shadow-lg hover:shadow-md hover:shadow-orange-300 my-6 font-semibold px-6 py-3 rounded-s-2xl mx-1 duration-300 bg-blue-300">
            <Link to="/search">Find Your Jam </Link>
          </button>
          <button className="btn btn-secondary btn-lg shadow-lg hover:shadow-md hover:shadow-sky-300 my-6 font-semibold px-6 py-3 rounded-e-2xl mx-1 duration-300 bg-orange-300">
            <Link to="/browse">Discover New Hits </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
