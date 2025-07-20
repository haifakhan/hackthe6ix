import googlemaps
from dotenv import load_dotenv
import os

# Create the client
load_dotenv("keys.env") # load the keys from the .env file
api_key = os.getenv("GPLACES_API_KEY")
client = googlemaps.Client(key=api_key)

# Call distance_matrix
response = client.distance_matrix(
    origins=["Eiffel Tower, Paris"],
    destinations=["Louvre Museum, Paris"],
    mode="driving"
)

print(response)
