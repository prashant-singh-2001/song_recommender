import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useFavorites, { reloadFavorites } from "./useFavorites";

const song = { id: 1, artist: "A", song: "S", img_url: null, snippet: "ignored" };

describe("useFavorites", () => {
  beforeEach(() => reloadFavorites()); // storage is cleared by the test setup

  it("toggles a favourite on and off", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(1)).toBe(false);
    act(() => result.current.toggle(song));
    expect(result.current.isFavorite(1)).toBe(true);
    act(() => result.current.toggle(song));
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("persists only the card fields and survives a reload", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(song));
    const stored = JSON.parse(localStorage.getItem("lyriclink.favorites"));
    expect(stored).toEqual([{ id: 1, artist: "A", song: "S", img_url: null }]);
    act(() => reloadFavorites());
    expect(result.current.favorites).toHaveLength(1);
  });

  it("shares state between hook users", () => {
    const a = renderHook(() => useFavorites());
    const b = renderHook(() => useFavorites());
    act(() => a.result.current.toggle(song));
    expect(b.result.current.isFavorite(1)).toBe(true);
  });
});
