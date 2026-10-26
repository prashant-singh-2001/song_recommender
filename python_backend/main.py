from pathlib import Path
import pickle
import random

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz import fuzz, process

import text_utils  # noqa: F401  (the unpickled vectorizer references it)

BASE = Path(__file__).parent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

songs = pickle.load(open(BASE / "songs.pkl", "rb"))
index = pickle.load(open(BASE / "index.pkl", "rb"))
vectorizer = index["vectorizer"]
matrix = index["matrix"]
matrix_t = matrix.T.tocsc()
neighbours = index["neighbours"]
scores = index["scores"]

# Pre-lowercased once so matching is case-insensitive.
titles_lower = songs["song"].str.lower().tolist()
artists_lower = songs["artist"].str.lower().tolist()

TITLE_CUTOFF = 80
MIN_FUZZY_LEN = 4
LYRICS_CUTOFF = 0.05
MAX_RESULTS = 30


def to_record(i, **extra):
    row = songs.iloc[i]
    img = row["img_url"]
    return {
        "id": int(row["id"]),
        "artist": row["artist"],
        "song": row["song"],
        "img_url": img if isinstance(img, str) else None,
        **extra,
    }


def get_row(song_id):
    if not 0 <= song_id < len(songs):
        raise HTTPException(status_code=404, detail="Song not found.")
    return song_id


@app.get("/search")
def search(q: str = Query(..., min_length=2, max_length=100)):
    """Search by title, artist and lyrics; returns matching songs."""
    query = q.lower().strip()
    found = {}

    for lst, label in ((titles_lower, "title"), (artists_lower, "artist")):
        hits = process.extract(
            query, lst, scorer=fuzz.WRatio, score_cutoff=TITLE_CUTOFF, limit=20
        )
        for target, _, i in hits:
            # WRatio over-scores very short names ("X", "Be"); require an exact hit.
            if len(target) < MIN_FUZZY_LEN and target != query:
                continue
            found.setdefault(i, label)

    qv = vectorizer.transform([q])
    if qv.nnz:
        sims = (matrix @ qv.T).toarray().ravel()
        for i in np.argsort(-sims)[:20]:
            if sims[i] > LYRICS_CUTOFF:
                found.setdefault(int(i), "lyrics")

    return [to_record(i, match=m) for i, m in list(found.items())[:MAX_RESULTS]]


@app.get("/songs/{song_id}")
def get_song(song_id: int):
    return to_record(get_row(song_id))


@app.get("/songs/{song_id}/recommendations")
def get_recommendations(song_id: int):
    get_row(song_id)
    return [
        to_record(int(j), score=round(float(s), 4))
        for j, s in zip(neighbours[song_id], scores[song_id])
    ]


@app.get("/browse")
def browse(limit: int = Query(50, ge=1, le=100)):
    """Fetches `limit` random songs."""
    picks = random.sample(range(len(songs)), min(limit, len(songs)))
    return [to_record(i) for i in picks]
