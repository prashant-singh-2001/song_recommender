import { describe, it, expect, vi, afterEach } from "vitest";
import { isValidUrl, browseSongs, spotifyUrl, youtubeUrl } from "./api";

afterEach(() => vi.restoreAllMocks());

describe("isValidUrl", () => {
  it("accepts http(s) urls", () => {
    expect(isValidUrl("https://x.test/a.png")).toBe(true);
    expect(isValidUrl("http://x.test/a.png")).toBe(true);
  });
  it("rejects null, undefined and sentinel strings", () => {
    expect(isValidUrl(null)).toBe(false);
    expect(isValidUrl(undefined)).toBe(false);
    expect(isValidUrl("Album cover not found.")).toBe(false);
  });
});

describe("external links", () => {
  const song = { song: "Hello World", artist: "A & B" };
  it("encodes the query", () => {
    expect(spotifyUrl(song)).toBe("https://open.spotify.com/search/Hello%20World%20A%20%26%20B");
    expect(youtubeUrl(song)).toContain("search_query=Hello%20World%20A%20%26%20B");
  });
});

describe("browseSongs", () => {
  it("sends limit, offset and seed", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    await browseSongs({ limit: 24, offset: 48, seed: 7 });
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain("/browse?");
    expect(url).toContain("limit=24");
    expect(url).toContain("offset=48");
    expect(url).toContain("seed=7");
  });
  it("omits seed when not provided and throws on errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal("fetch", fetchMock);
    await expect(browseSongs()).rejects.toMatchObject({ status: 500 });
    expect(fetchMock.mock.calls[0][0]).not.toContain("seed=");
  });
});
