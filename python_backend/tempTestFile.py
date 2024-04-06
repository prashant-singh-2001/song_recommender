import pickle
from fuzzywuzzy import process

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


# Get song data based on the recommended indexes
recommended_song_data = dict(recommend_song(' Voices'))
if list(recommended_song_data) != []:
    print("\nRecommended Song Data:")
    print(recommended_song_data['artist'])
