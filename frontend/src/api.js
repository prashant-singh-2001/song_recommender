// In Docker the app is served by nginx, which proxies /api to the backend.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function get(path, signal) {
  const response = await fetch(`${API_URL}${path}`, { signal });
  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export const searchSongs = (q, signal) =>
  get(`/search?q=${encodeURIComponent(q)}`, signal);
export const getSong = (id, signal) => get(`/songs/${id}`, signal);
export const getRecommendations = (id, signal) =>
  get(`/songs/${id}/recommendations`, signal);

// Returns { items, total, seed, next_offset }. Pass the returned seed back to
// keep paging through the same random order.
export function browseSongs({ limit = 50, offset = 0, seed } = {}, signal) {
  const params = new URLSearchParams({ limit, offset });
  if (seed !== undefined && seed !== null) params.set("seed", seed);
  return get(`/browse?${params}`, signal);
}

export function isValidUrl(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

const query = (song) => encodeURIComponent(`${song.song} ${song.artist}`);
export const spotifyUrl = (song) => `https://open.spotify.com/search/${query(song)}`;
export const youtubeUrl = (song) =>
  `https://www.youtube.com/results?search_query=${query(song)}`;
