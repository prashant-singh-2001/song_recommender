import pickle
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from main import app, songs
from build_index import norm_title

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "songs": len(songs)}


def test_search_matches_title_and_returns_snippet():
    title = songs.iloc[0]["song"]
    r = client.get("/search", params={"q": title})
    assert r.status_code == 200
    hits = r.json()
    assert any(h["id"] == 0 and h["match"] == "title" for h in hits)
    assert all(h["snippet"] for h in hits)


def test_search_matches_artist():
    artist = songs.iloc[0]["artist"]
    hits = client.get("/search", params={"q": artist}).json()
    assert any(h["artist"] == artist for h in hits)


def test_search_matches_lyrics():
    hits = client.get("/search", params={"q": "lonely road tonight"}).json()
    assert any(h["match"] == "lyrics" for h in hits)


def test_search_gibberish_is_empty():
    assert client.get("/search", params={"q": "zxqvbn"}).json() == []


@pytest.mark.parametrize("q", ["a", "x" * 101])
def test_search_validates_length(q):
    assert client.get("/search", params={"q": q}).status_code == 422


def test_song_not_found():
    assert client.get("/songs/999999").status_code == 404
    assert client.get("/songs/-1").status_code == 404
    assert client.get("/songs/999999/recommendations").status_code == 404


def test_recommendations_exclude_self_and_covers():
    for song_id in (0, 5, 1234):
        recs = client.get(f"/songs/{song_id}/recommendations").json()
        assert 0 < len(recs) <= 20
        me = norm_title(songs.iloc[song_id]["song"])
        assert all(r["id"] != song_id for r in recs)
        assert all(norm_title(r["song"]) != me for r in recs)


def test_browse_pages_do_not_overlap_for_a_seed():
    first = client.get("/browse", params={"limit": 50, "offset": 0, "seed": 7}).json()
    second = client.get("/browse", params={"limit": 50, "offset": 50, "seed": 7}).json()
    ids_a = {s["id"] for s in first["items"]}
    ids_b = {s["id"] for s in second["items"]}
    assert len(first["items"]) == 50 and not ids_a & ids_b
    assert first["seed"] == 7 and first["next_offset"] == 50
    again = client.get("/browse", params={"limit": 50, "offset": 0, "seed": 7}).json()
    assert [s["id"] for s in again["items"]] == [s["id"] for s in first["items"]]


def test_browse_last_page_has_no_next_offset():
    page = client.get("/browse", params={"limit": 100, "offset": 19950, "seed": 1}).json()
    assert page["next_offset"] is None and len(page["items"]) == 50


def test_pickles_are_consistent():
    base = Path(__file__).resolve().parent.parent
    lyrics = pickle.load(open(base / "lyrics.pkl", "rb"))
    assert len(lyrics) == len(songs)
    assert list(songs["id"]) == list(range(len(songs)))
