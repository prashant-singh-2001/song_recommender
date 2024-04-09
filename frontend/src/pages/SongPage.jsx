import React from "react";
import SongComponent from "../components/SongComponent.jsx";
import RecommendationComponent from "../components/RecommendationComponent.jsx";
const SongPage = ({ Song, Recommend, SetSong, SetRecommend }) => {
  return (
    <div className="flex min-w-max  min-h-full flex-col items-center ">
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
