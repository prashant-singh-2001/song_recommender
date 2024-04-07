from pydantic import BaseModel


class Song(BaseModel):
    """
    Represents a song with a name attribute.
    """
    name: str  # Name of the song (string)
