import React from "react";
import SongComponent from "../components/SongComponent.jsx";
import RecommendationComponent from "../components/RecommendationComponent.jsx";
const SongPage = ({ Song, Recommend, SetSong, SetRecommend }) => {
  return (
    <div className="flex min-w-max  min-h-screen flex-col items-center ">
      <p className="pb-2 w-full bg-slate-200 mr-auto font-semibold text-4xl font-Croissant">
        LyricLink
      </p>
      <div className="w-full h-screen  flex flex-col">
        <div className="h-1/4">
          <SongComponent Song={Song} />
        </div>
        <div className="h-3/4 ">
          <RecommendationComponent
            Recommend={Recommend}
            SetSong={SetSong}
            SetRecommend={SetRecommend}
          />
        </div>
      </div>
    </div>
  );
};

export default SongPage;
