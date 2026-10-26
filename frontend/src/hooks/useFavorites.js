import { useSyncExternalStore } from "react";

const STORAGE_KEY = "lyriclink.favorites";
const listeners = new Set();

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let favorites = read();

function commit(next) {
  favorites = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode, quota): keep favourites in memory only.
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => favorites;

// Re-read from storage (used by tests and the cross-tab "storage" event).
export function reloadFavorites() {
  favorites = read();
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) reloadFavorites();
  });
}

export default function useFavorites() {
  const list = useSyncExternalStore(subscribe, getSnapshot);

  const isFavorite = (id) => list.some((s) => s.id === id);
  const toggle = (song) => {
    if (isFavorite(song.id)) {
      commit(list.filter((s) => s.id !== song.id));
    } else {
      const { id, artist, song: title, img_url } = song;
      commit([...list, { id, artist, song: title, img_url }]);
    }
  };

  return { favorites: list, isFavorite, toggle };
}
