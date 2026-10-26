import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import SongComponent from "../components/SongComponent.jsx";
import RecommendationComponent from "../components/RecommendationComponent.jsx";
import Status from "../components/Status.jsx";
import { getSong, getRecommendations } from "../api";

const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [recommend, setRecommend] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound | error
  const [attempt, setAttempt] = useState(0);

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
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (status !== "ok") {
    return (
      <main>
        <Status
          loading={status === "loading"}
          error={status === "error" ? "Could not load this song. Please try again." : null}
          onRetry={retry}
          empty={status === "notfound"}
          emptyText="Song not found."
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col items-center p-2">
      <SongComponent Song={song} />
      <RecommendationComponent Recommend={recommend} />
    </main>
  );
};

export default SongPage;
