import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongComponent from "../components/SongComponent.jsx";
import RecommendationComponent from "../components/RecommendationComponent.jsx";
import { getSong, getRecommendations } from "../api";

const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [recommend, setRecommend] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound | error

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    Promise.all([
      getSong(id, controller.signal),
      getRecommendations(id, controller.signal),
    ])
      .then(([s, r]) => {
        setSong(s);
        setRecommend(r);
        setStatus("ok");
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setStatus(e.status === 404 ? "notfound" : "error");
      });
    return () => controller.abort();
  }, [id]);

  if (status === "loading")
    return <p className="mt-8 text-center text-gray-600">Loading…</p>;
  if (status === "notfound")
    return <p className="mt-8 text-center text-gray-600">Song not found.</p>;
  if (status === "error")
    return (
      <p className="mt-8 text-center text-red-600">
        Could not load this song. Please try again.
      </p>
    );

  return (
    <div className="flex min-h-full flex-col items-center">
      <div className="w-full flex flex-col">
        <SongComponent Song={song} />
        <RecommendationComponent Recommend={recommend} />
      </div>
    </div>
  );
};

export default SongPage;
