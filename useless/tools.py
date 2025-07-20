from langchain.agents import Tool
import os
import googlemaps
from googlemaps import Client
from dotenv import load_dotenv

# Load the API key from the .env file
load_dotenv("keys.env")  # Load the keys from the .env file
api_key = os.getenv("GPLACES_API_KEY")


# Tool for calculating distance 
def get_distance(input_str):
    # Split the input string into origin and destination
    origin, destination = input_str.split(" to ")

    client = Client(key=api_key)
    result = client.distance_matrix(origins=origin, destinations=destination, mode="driving")
    distance = result["rows"][0]["elements"][0]["distance"]["text"]
    duration = result["rows"][0]["elements"][0]["duration"]["text"]
    return distance, duration


#tool for image analysis from ML model
def skin_analysis(image_path):
    # Placeholder ML model
    result = model.predict(image_path)
    return result




