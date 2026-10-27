"""Builds songs.pkl, lyrics.pkl and index.pkl from the raw Kaggle CSV.

Usage (run inside the backend container so pickles match runtime versions):
    pip install -r requirements-build.txt
    python build_index.py

Optional: set LASTFM_API_KEY to fetch album covers that are not already known.
Covers fetched are cached in covers_cache.json so an interrupted run resumes.
Covers already present in an existing songs.pkl are always reused.
"""
import json
import os
import pickle
import re
import time
from pathlib import Path

import numpy as np
import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer

from text_utils import clean, tokenize

BASE = Path(__file__).parent
CSV = BASE / "ml_recommend" / "spotify_millsongdata.csv"
SONGS = BASE / "songs.pkl"
LYRICS = BASE / "lyrics.pkl"
INDEX = BASE / "index.pkl"
CACHE = BASE / "covers_cache.json"
SAMPLE_SIZE = 20000
SEED = 42
TOP_K = 20
POOL = 50  # candidates considered before re-ranking
CHUNK = 1000
NEAR_DUPLICATE = 0.9  # lyric cosine above this means "same song, different upload"
ARTIST_BOOST = 0.05


def key(artist, song):
    return f"{artist}\u0001{song}"


def norm_title(title):
    """Lowercase, drop (live)/[remix]-style suffixes and punctuation."""
    title = re.sub(r"[\(\[].*?[\)\]]", " ", title.lower())
    return re.sub(r"[^a-z0-9]+", " ", title).strip()


def known_covers():
    """Covers from the previous songs.pkl plus the resumable fetch cache."""
    covers = {}
    if SONGS.exists():
        old = pickle.load(open(SONGS, "rb"))
        for a, s, u in zip(old["artist"], old["song"], old["img_url"]):
            if isinstance(u, str) and u.startswith(("http://", "https://")):
                covers[key(a, s)] = u
    if CACHE.exists():
        covers.update(json.loads(CACHE.read_text(encoding="utf-8")))
    return covers


def fetch_cover(artist, song, api_key):
    try:
        r = requests.get(
            "https://ws.audioscrobbler.com/2.0/",
            params={"method": "track.getInfo", "api_key": api_key,
                    "artist": artist, "track": song, "format": "json"},
            timeout=10,
        )
        images = r.json().get("track", {}).get("album", {}).get("image", [])
        for img in reversed(images):
            if img.get("#text"):
                return img["#text"]
    except Exception:
        pass
    return None


def rerank(row, cands, sims, titles, artists):
    """Pick TOP_K from the candidate pool.

    Drops covers (same normalised title as the song itself), near-duplicate
    lyrics and repeated titles, then boosts songs by the same artist.
    """
    seen = {titles[row]}
    kept = []
    for j in cands:
        s = float(sims[j])
        if s <= 0 or s > NEAR_DUPLICATE or titles[j] in seen:
            continue
        seen.add(titles[j])
        kept.append((s + (ARTIST_BOOST if artists[j] == artists[row] else 0), j, s))
    kept.sort(key=lambda t: -t[0])
    return [(j, s) for _, j, s in kept[:TOP_K]]


def main():
    df = pd.read_csv(CSV).drop(columns=["link"])
    df = df.drop_duplicates(["artist", "song"])
    df = df.sample(SAMPLE_SIZE, random_state=SEED).reset_index(drop=True)
    df.insert(0, "id", np.arange(len(df)))

    covers = known_covers()
    reused = sum(key(a, s) in covers for a, s in zip(df["artist"], df["song"]))
    fetched = 0
    api_key = os.environ.get("LASTFM_API_KEY")
    if api_key:
        for n, (a, s) in enumerate(zip(df["artist"], df["song"])):
            k = key(a, s)
            if k in covers:
                continue
            url = fetch_cover(a, s, api_key)
            covers[k] = url or ""
            fetched += bool(url)
            time.sleep(0.25)
            if n % 200 == 0:
                CACHE.write_text(json.dumps(covers), encoding="utf-8")
        CACHE.write_text(json.dumps(covers), encoding="utf-8")
    df["img_url"] = [covers.get(key(a, s)) or None
                     for a, s in zip(df["artist"], df["song"])]

    vectorizer = TfidfVectorizer(
        preprocessor=clean, tokenizer=tokenize, token_pattern=None,
        min_df=2, dtype=np.float32,
    )
    matrix = vectorizer.fit_transform(df["text"]).tocsr()

    n = matrix.shape[0]
    titles = [norm_title(s) for s in df["song"]]
    artists = df["artist"].str.lower().tolist()
    neighbours = np.zeros((n, TOP_K), dtype=np.int32)
    scores = np.zeros((n, TOP_K), dtype=np.float32)
    matrix_t = matrix.T.tocsc()
    short = 0
    for start in range(0, n, CHUNK):
        end = min(start + CHUNK, n)
        sims = (matrix[start:end] @ matrix_t).toarray()
        sims[np.arange(end - start), np.arange(start, end)] = -1  # never itself
        pool = np.argpartition(-sims, POOL, axis=1)[:, :POOL]
        for r in range(end - start):
            row = start + r
            cands = pool[r][np.argsort(-sims[r, pool[r]])]
            picked = rerank(row, cands, sims[r], titles, artists)
            short += len(picked) < TOP_K
            for k, (j, s) in enumerate(picked):
                neighbours[row, k] = j
                scores[row, k] = min(s, 1.0)
            # Rows with fewer than TOP_K survivors repeat their best entry's
            # slot as -1 so the API can drop it.
            for k in range(len(picked), TOP_K):
                neighbours[row, k] = -1

    songs = df[["id", "artist", "song", "img_url"]]
    lyrics = [re.sub(r"\s+", " ", t).strip() for t in df["text"]]
    pickle.dump(songs, open(SONGS, "wb"))
    pickle.dump(lyrics, open(LYRICS, "wb"))
    pickle.dump(
        {"vectorizer": vectorizer, "matrix": matrix,
         "neighbours": neighbours, "scores": scores},
        open(INDEX, "wb"),
    )

    ids = np.arange(n)[:, None]
    assert not (neighbours == ids).any(), "self-recommendation"
    for row in range(n):
        picked = [j for j in neighbours[row] if j >= 0]
        assert all(titles[j] != titles[row] for j in picked), "cover as recommendation"
    print(f"songs={n} covers: reused={reused} fetched={fetched} "
          f"missing={int(songs['img_url'].isna().sum())} short_lists={short}")


if __name__ == "__main__":
    main()
