### figure user id stuff out

# Importing stuff

# .env stuff
from dotenv import load_dotenv

# memory
from langchain.memory import ConversationBufferMemory

# prompts
from langchain_core.prompts import ChatPromptTemplate 

# let us define convo history
from langchain_core.messages import SystemMessage, HumanMessage
from langchain.schema import AIMessage

# operating system
import os

# connecting to gemini
from langchain_google_genai import ChatGoogleGenerativeAI

# creating the agents (handling tools)
from langchain.agents import initialize_agent, AgentType, Tool
from langchain_community.tools import GooglePlacesTool # maybe we can check for more useful tools
from langchain_community.utilities.google_places_api import GooglePlacesAPIWrapper

# importing the tools i made
from ai_chatbot.tools import get_distance 

# importing mongo db stuff
from pymongo import MongoClient
import datetime




#keys
load_dotenv("keys.env") # load the keys from the .env file
gemini_key = os.getenv("GOOGLE_API_KEY")
maps_key = os.getenv("GPLACES_API_KEY")
gplaceapi = GooglePlacesAPIWrapper(gplaces_api_key=maps_key)





# mongo db connection
mongo_client = MongoClient(os.getenv("MONGO_URI")) ### need to set this up in the .env file
db = mongo_client["medicalAI"] # database name
collection = db["chat_history"] # collection name

#Saving a message to the MongoDB collection
def save_message(user_id, role, content):
    message = {
        "user_id": user_id, # unique indetifier for user
        "role": role, # role can be user or ai
        "content": content, # content of the message
        "timestamp": datetime.datetime.utcnow()  # store the timestamp
    }
    collection.insert_one(message)

def load_history(user_id):
    # Load the chat history for a specific user
    messages = collection.find({"user_id": user_id}).sort("_id", 1)  # sort by inserted order
    history = []
    for msg in messages:
        if msg["role"] == "user":
            history.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "ai":
            history.append(AIMessage(content=msg["content"]))
    return history

memory = ConversationBufferMemory(
    memory_key="chat_history", # this is the name of the variable where the convo history will be stored
    return_messages=True,
)
memory.chat_memory.messages = load_history(user_id)  # Load history for a specific user
### just remember to save the messages after each interaction



# creating the gemini chat model 
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=gemini_key) #gemini 1.5 might be too basic but it is free


# creating the tools 
tools = [
    Tool(
        name="SearchMaps",
        func=GooglePlacesTool(api_wrapper=gplaceapi),
        description="Your input should be one string. Use this tool only when the user's question requires finding real-world, location-dependent results — such as nearby hospitals, clinics, doctors, or pharmacies related to a disease or health issue. Always focus the search on places closest to the provided origin location, and narrow the response to only the top, most relevant options based on quality or proximity. To help narrow the search, analyze the location's zip codes and compare to the origin location, the more similar the zip codes, the closer they are. Return concise, actionable results. Do not use this tool for general health questions that do not depend on physical locations."
    ),
    Tool(
        name="GetDistance",
        func=get_distance,  # assuming get_distance is defined in tools.py
    description="Use this tool TO CALCULATE DISTANCE BETWEEN TWO LOCATIONS. YOUR INPUT SHOULD BE OF THE FORMAT 'origin to destination'. CALCULATE DISTANCES FOR AT LEAST 10 PLACES YOU GOT FROM SEARCHMAP BEFORE YOUR FINAL OUTPUT. DO NOT STOP AT 3 CALCULATIONS, YOU WILL HAVE TO USE THIS TOOL MULTIPLE TIMES. THE OUTPUT WILL BE THE DISTANCE AND DURATION FOR EACH CALL."
    )
]





# creating the agent
systemMessage = "" # you can make this personalized based on user profile. just use f-strings to include user info

agent = initialize_agent(
    tools, # which tools are at the agent's disposal
    llm, # whats the model for this agent 
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    memory=memory, # loading memory for the agent
    verbose=True, # thought process
    SystemMessage=systemMessage #preamble for the agent
)





# calling the agent
# infinite loop to keep the agent running until the user dismisses it 
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "stop", "bye"]:
        print("Exiting the agent. Goodbye!")
        break
    
    # Save the user input to MongoDB
    save_message(user_id, "user", user_input)
    
    # Run the agent with the user input
    response = agent.run(user_input)
    
    # Save the AI response to MongoDB
    save_message(user_id, "ai", response)
    
    # Print the AI response
    print(f"AI: {response}")

