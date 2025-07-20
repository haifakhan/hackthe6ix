import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.agents import initialize_agent, AgentType, Tool
from langchain.tools import tool
from langchain_community.document_loaders import WebBaseLoader
import requests
from bs4 import BeautifulSoup

def crawl_page(url):
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, "html.parser")
    # Extract text from paragraphs
    paragraphs = soup.find_all("p")
    text = "\n".join(p.get_text() for p in paragraphs)
    return text

systemMessage = "You are MedAI, an intelligent, friendly, and knowledgeable medical assistant. Your goal is to help users understand their health, possible risk factors, and general medical information based on their personal context (age, sex, medical history, lifestyle, etc.). You do not diagnose conditions or prescribe treatments; instead, you provide clear, trustworthy explanations and guide the user to consult qualified healthcare professionals when appropriate. Use plain, empathetic language suitable for everyday users. Summarize complex medical terms so they are easy to understand. When suggesting actions, always remind the user to seek advice from a real doctor.If relevant, ask thoughtful follow-up questions to learn more about the user’s symptoms, habits, and concerns. If you need to search for local services (hospitals, clinics, etc.) or calculate distances, use your integrated tools to do so. If you get an image, analyze it, use your integrated tool and explain what you see, but remind the user it’s not a substitute for professional analysis.Always keep your answers factual, supportive, and concise. Be proactive but never alarmist. Safety, clarity, and user trust come first."

os.environ["GOOGLE_API_KEY"] = "AIzaSyDTOmczCP_8m-C-XhFJDoLPVudIq3xg7uY"
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

urls = [
    "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)",
    "https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353118",
    "https://www.nhs.uk/conditions/coronary-heart-disease/",
    "https://www.cdc.gov/heartdisease/facts.htm",
    "https://www.who.int/news-room/fact-sheets/detail/diabetes",
    "https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/symptoms-causes/syc-20351193",
    "https://www.cdc.gov/diabetes/basics/what-is-diabetes.html",
    "https://www.nhs.uk/conditions/type-2-diabetes/",
    "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    "https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/",
    "https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803",
    "https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/",
    "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/healthy-diet/art-20046267",
    "https://www.nutrition.gov/topics/basic-nutrition/healthy-eating",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    "https://www.cdc.gov/physical-activity-basics/index.html",
    "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise/art-20048389",
    "https://www.who.int/news-room/fact-sheets/detail/immunization-coverage",
    "https://www.cdc.gov/vaccines/vac-gen/imz-basics.htm",
    "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/vaccines/art-20048334",
    "https://www.who.int/news-room/fact-sheets/detail/cancer",
    "https://www.cdc.gov/cancer/dcpc/prevention/index.htm",
    "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/cancer-prevention/art-20044816"
]

texts = [crawl_page(url) for url in urls]

text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)

documents = text_splitter.create_documents(texts)
vectorstore = Chroma.from_documents(documents, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

def medical_rag(query: str) -> str:
    """Search trusted medical sources and return relevant information."""
    results = retriever.get_relevant_documents(query)
    summaries = "\n".join([doc.page_content for doc in results])
    return f"Here’s what trusted sources say:\n{summaries}"

def dummy_tool(input):
    return systemMessage



agent = initialize_agent(
    tools=[
        Tool(
            name="ai_chatbot",
            func=dummy_tool,
            description=systemMessage),
        Tool(
            name="medical_rag",
            func=medical_rag,
            description="Search trusted medical sources and return relevant information.")
    ],
    llm=llm,
    agent_type=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    verbose=True,
    system_message=systemMessage
)

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "stop", "bye"]:
        print("Exiting the agent. Goodbye!")
        break
    response = agent({"input": user_input})
    print("Agent:", response)