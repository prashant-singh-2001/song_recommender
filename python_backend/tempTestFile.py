import pandas as pd
import pickle
import requests

# Load the DataFrame from the pickle file
with open('data.pkl', 'rb') as file:
    df = pickle.load(file)


