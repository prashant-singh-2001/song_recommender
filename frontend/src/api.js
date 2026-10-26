export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

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
export const browseSongs = (limit = 50, signal) =>
  get(`/browse?limit=${limit}`, signal);

export function isValidUrl(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}
