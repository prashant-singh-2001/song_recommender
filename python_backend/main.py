import os
import pickle
import random
import re
from pathlib import Path
from typing import List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rapidfuzz import fuzz, process

import text_utils  # noqa: F401  (the unpickled vectorizer references it)

BASE = Path(__file__).parent

app = FastAPI()

# Comma-separated list of allowed browser origins.
origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins.split(",") if o.strip()],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

songs = pickle.load(open(BASE / "songs.pkl", "rb"))
lyrics = pickle.load(open(BASE / "lyrics.pkl", "rb"))
index = pickle.load(open(BASE / "index.pkl", "rb"))
vectorizer = index["vectorizer"]
matrix = index["matrix"]
neighbours = index["neighbours"]
scores = index["scores"]

# Pre-lowercased once so matching is case-insensitive.
titles_lower = songs["song"].str.lower().tolist()
artists_lower = songs["artist"].str.lower().tolist()

TITLE_CUTOFF = 80
MIN_FUZZY_LEN = 4
LYRICS_CUTOFF = 0.05
MAX_RESULTS = 30
SNIPPET_LEN = 160


class SongOut(BaseModel):
    id: int
    artist: str
    song: str
    img_url: Optional[str] = None


class SearchHit(SongOut):
    match: str  # "title", "artist" or "lyrics"
    snippet: str


class Recommendation(SongOut):
    score: float


class BrowsePage(BaseModel):
    items: List[SongOut]
    total: int
    seed: int
    next_offset: Optional[int] = None


class Health(BaseModel):
    status: str
    songs: int


def to_record(i):
    row = songs.iloc[i]
    img = row["img_url"]
    return {
        "id": int(row["id"]),
        "artist": row["artist"],
        "song": row["song"],
        "img_url": img if isinstance(img, str) else None,
    }


def snippet(i, terms):
    """~SNIPPET_LEN characters of lyrics, centred on the first matched term."""
    text = lyrics[i]
    low = text.lower()
    pos = -1
    for term in terms:
        pos = low.find(term)
        if pos >= 0:
            break
    start = max(0, pos - SNIPPET_LEN // 3) if pos >= 0 else 0
    piece = text[start:start + SNIPPET_LEN].strip()
    lead = "…" if start > 0 else ""
    tail = "…" if start + SNIPPET_LEN < len(text) else ""
    return lead + piece + tail


def get_row(song_id):
    if not 0 <= song_id < len(songs):
        raise HTTPException(status_code=404, detail="Song not found.")
    return song_id


@app.get("/health", response_model=Health)
def health():
    return {"status": "ok", "songs": len(songs)}


@app.get("/search", response_model=List[SearchHit])
def search(q: str = Query(..., min_length=2, max_length=100)):
    """Search by title, artist and lyrics; returns matching songs."""
    query = q.lower().strip()
    terms = [t for t in re.findall(r"[a-z']+", query) if len(t) >= 3] or [query]
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

    return [
        {**to_record(i), "match": m, "snippet": snippet(i, terms)}
        for i, m in list(found.items())[:MAX_RESULTS]
    ]


@app.get("/songs/{song_id}", response_model=SongOut)
def get_song(song_id: int):
    return to_record(get_row(song_id))


@app.get("/songs/{song_id}/recommendations", response_model=List[Recommendation])
def get_recommendations(song_id: int):
    get_row(song_id)
    return [
        {**to_record(int(j)), "score": round(float(s), 4)}
        for j, s in zip(neighbours[song_id], scores[song_id])
        if j >= 0
    ]


@app.get("/browse", response_model=BrowsePage)
def browse(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    seed: Optional[int] = Query(None, ge=0, le=2**31 - 1),
):
    """A page of songs in a seeded random order (stable across pages)."""
    if seed is None:
        seed = random.randrange(2**31)
    order = np.random.default_rng(seed).permutation(len(songs))
    page = order[offset:offset + limit]
    nxt = offset + limit
    return {
        "items": [to_record(int(i)) for i in page],
        "total": len(songs),
        "seed": seed,
        "next_offset": nxt if nxt < len(songs) else None,
    }
