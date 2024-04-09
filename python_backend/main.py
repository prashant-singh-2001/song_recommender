import random
import uvicorn  # ASGI server for running FastAPI applications
from fastapi import FastAPI  # Web framework for building APIs
# Cross-Origin Resource Sharing middleware
from fastapi.middleware.cors import CORSMiddleware
from Song import Song  # Custom class representing song data (assumed)
import pickle  # For loading pre-processed data from pickle files
from fuzzywuzzy import process  # For fuzzy string matching
import warnings  # For warning suppression (optional)

app = FastAPI()  # Create a FastAPI application instance

app.add_middleware(
    CORSMiddleware,
    # Allow requests from any origin (for development purposes)
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

with open('data.pkl', 'rb') as file:
    # Load the pre-processed DataFrame containing song data
    df = pickle.load(file)

with open('similarity_dict.pkl', 'rb') as file:
    # Load the pre-calculated similarity dictionary
    similarity_dict = pickle.load(file)


def get_song_data(index_list):
    """Extracts song data from the DataFrame based on the provided index list."""

    # Use iloc for efficient index-based selection
    song_data = df.iloc[index_list]
    return song_data


def recommend_song(song_name):
    """Recommends songs based on a given song name, using exact matching or fuzzy matching."""

    if song_name in similarity_dict:
        # Exact match found in similarity dictionary
        similar_songs = similarity_dict[song_name]
        recommended_indices = [index for index, _ in similar_songs]
        return get_song_data(recommended_indices)
    else:
        # Use fuzzy string matching for closest match
        closest_match, _ = process.extractOne(
            song_name, similarity_dict.keys())
        # Recommend songs based on the closest match
        return recommend_song(closest_match)


@app.post('/search')
def search_songs(data: Song):
    """Searches for songs and returns recommendations."""

    # Extract and lowercase song name
    s_name = data.model_dump()['name'].lower()
    recommended_songs = recommend_song(s_name)

    if recommended_songs is not None:
        return {
            'success': True,
            'result': {
                'artist': recommended_songs.get('artist'),
                'song': recommended_songs.get('song'),
                'img_url': recommended_songs.get('img_url')
            }
        }
    else:
        return {'success': False, 'error': 404, 'error_message': 'Song data not found.'}


@app.post('/song')
def get_song(data: Song):
    """Retrieves song data based on the exact song name."""

    s_name = data.name
    res = df[df['song'] == s_name]  # Filter DataFrame based on song name

    if res.empty:
        return {'success': False, 'error': 404, 'error_message': 'Song data not found.'}
    else:
        # Get the first match and convert it to dictionary for response
        result = res.iloc[0].to_dict()
        return {'success': True, 'result': result}


@app.get("/browse")
def browse_songs():
    """Fetches 50 random songs."""

    # Check if DataFrame is empty
    if df.empty:
        return {'success': False, 'error': 404, 'error_message': 'No songs available.'}
    else:
        # Select 50 random indices
        random_indices = random.sample(range(len(df)), min(len(df), 52))
        # Select songs based on random indices
        random_songs = df.iloc[random_indices]
        # Convert selected songs to list of dictionaries for response
        result = random_songs.to_dict('records')
        return {'success': True, 'result': result}


# Uncomment to run the server (typically for local development or testing):
# if __name__ == '__main__':
#     uvicorn.run(app, host='127.0.0.1', port=8000)
