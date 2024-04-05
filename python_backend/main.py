import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Song import Song
import pickle
from fuzzywuzzy import process
import warnings

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
with open('data.pkl', 'rb') as file:
    df = pickle.load(file)

# Load the similarity dictionary
with open('similarity_dict.pkl', 'rb') as file:
    similarity_dict = pickle.load(file)


def get_song_data(index_list):

    # Extract song data based on the provided indexes
    song_data = df.iloc[index_list]

    return song_data


def recommend_song(song_name):
    # Check if the exact song name is in the similarity dictionary
    if song_name in similarity_dict:
        similar_songs = similarity_dict[song_name]
        recommended_indices = [index for index, _ in similar_songs]
        recommended_songs = get_song_data(recommended_indices)
        return recommended_songs
    else:
        # If exact match not found, find the closest match using fuzzy string matching
        closest_match, _ = process.extractOne(
            song_name, similarity_dict.keys())
        similar_songs = similarity_dict[closest_match]
        recommended_indices = [index for index, _ in similar_songs]
        recommended_songs = get_song_data(recommended_indices)
        return recommended_songs


@app.post('/search')
def search_songs(data: Song):
    s_name = data.model_dump()['name']
    res = recommend_song(s_name)
    if res != []:
        return {
            'success': True,
            'result': res
        }
    else:
        return {
            'success': False,
            'error': 404,
            'error_message': 'Song data not found.'
        }


@app.post('/recommend')
def recommend(data: Song):
    s_name = data.model_dump()['name']
    res = recommend_song(s_name)
    if res != []:
        return {
            'success': True,
            'result': res
        }
    else:
        return {
            'success': False,
            'error': 404,
            'error_message': 'Song data not found.'
        }


@app.post('/song')
def get_song(data: Song):
    res = []
    s_name = data.name
    res.append(df[df['song'] == s_name])
    if res != []:
        return {
            'success': True,
            'result': res
        }
    else:
        return {
            'success': False,
            'error': 404,
            'error_message': 'Song data not found.'
        }

# if __name__ == '__main__':
#     uvicorn.run(app, host='127.0.0.1', port=8000)
