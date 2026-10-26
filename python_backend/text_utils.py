"""Text helpers shared by build_index.py and the API (the pickled vectorizer
references these functions, so they must stay importable)."""
import re

from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

_stemmer = PorterStemmer()
_TOKEN = re.compile(r"[a-z']+")


def clean(text):
    """Lowercase and collapse all whitespace (including \r\n) to single spaces."""
    return re.sub(r"\s+", " ", text.lower()).strip()


def tokenize(text):
    """Split into word tokens, drop English stop words and stem the rest."""
    return [
        _stemmer.stem(t)
        for t in _TOKEN.findall(text)
        if t not in ENGLISH_STOP_WORDS
    ]
