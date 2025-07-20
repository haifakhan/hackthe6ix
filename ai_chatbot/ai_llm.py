# Concerning the API Key
# 1-) export GOOGLE_API_KEY = "key" only works for the terminal to which you set it to
# 2-) using the key.env => from dotenv import load_dotenv // load_dotenv()

# Importing stuff

# .env stuff
from dotenv import load_dotenv
# helps structure prompts cleanly 
from langchain_core.prompts import ChatPromptTemplate 
# let us define convo history
from langchain_core.messages import SystemMessage, HumanMessage
# operating system
import os
# connecting to gemini
from langchain_google_genai import ChatGoogleGenerativeAI

#keys
load_dotenv("keys.env") # load the keys from the .env file
gemini_key = os.getenv("GOOGLE_API_KEY")

# creating the gemini chat model 
llm_gemini = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", google_api_key=gemini_key) #gemini 1.5 might be too basic but it is free


#example of user question
user_question = "I live at 104 Balliol St, Toronto, Ontario, Canada. Tell me the 3 nearest hospitals from where I live."

# defining a prompt template
prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You are a helpful assistant"), # preamble (sets behavior/personality)
    HumanMessage(content=user_question) # placeholder to user input
])

formatted_prompt = prompt.format_messages()

# calling model to get an answer
response = llm_gemini(formatted_prompt) # can also use the invoke method i believe
print('Gemini response:', response.content)
