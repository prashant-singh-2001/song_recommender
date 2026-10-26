"""Builds songs.pkl and index.pkl from the raw Kaggle CSV.

Usage (run inside the backend container so pickles match runtime versions):
    python build_index.py

Optional: set LASTFM_API_KEY to fetch album covers that are not already known.
Covers fetched are cached in covers_cache.json so an interrupted run resumes.
"""
import json
import os
import pickle
import time
from pathlib import Path

import numpy as np
import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer

from text_utils import clean, tokenize

BASE = Path(__file__).parent
CSV = BASE / "ml_recommend" / "spotify_millsongdata.csv"
OLD_DATA = BASE / "data.pkl"
CACHE = BASE / "covers_cache.json"
SAMPLE_SIZE = 20000
SEED = 42
TOP_K = 20
CHUNK = 1000


def key(artist, song):
    return f"{artist}\u0001{song}"


def known_covers():
    """Covers from the previous data.pkl plus the resumable fetch cache."""
    covers = {}
    if OLD_DATA.exists():
        old = pickle.load(open(OLD_DATA, "rb"))
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
    neighbours = np.zeros((n, TOP_K), dtype=np.int32)
    scores = np.zeros((n, TOP_K), dtype=np.float32)
    matrix_t = matrix.T.tocsc()
    for start in range(0, n, CHUNK):
        end = min(start + CHUNK, n)
        sims = (matrix[start:end] @ matrix_t).toarray()
        sims[np.arange(end - start), np.arange(start, end)] = -1  # never itself
        top = np.argpartition(-sims, TOP_K, axis=1)[:, :TOP_K]
        rows = np.arange(end - start)[:, None]
        order = np.argsort(-sims[rows, top], axis=1)
        top = top[rows, order]
        neighbours[start:end] = top
        scores[start:end] = sims[rows, top]

    songs = df[["id", "artist", "song", "img_url"]]
    pickle.dump(songs, open(BASE / "songs.pkl", "wb"))
    pickle.dump(
        {"vectorizer": vectorizer, "matrix": matrix,
         "neighbours": neighbours, "scores": scores},
        open(BASE / "index.pkl", "wb"),
    )

    assert not (neighbours == np.arange(n)[:, None]).any(), "self-recommendation"
    print(f"songs={n} covers: reused={reused} fetched={fetched} "
          f"missing={int(songs['img_url'].isna().sum())}")


if __name__ == "__main__":
    main()
