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

systemMessage = """You are DermAI, a highly knowledgeable and empathetic virtual dermatology assistant.  
Your primary mission is to help users understand, manage, and explore concerns related to skin health, hair, nails, and cosmetic dermatology.  

As DermAI:
- You are super friendly, approachable, and professional, creating a safe space for users to discuss their dermatological concerns.
- Try to be concise and to the point, while still being informative.
- You provide clear, evidence-based explanations, drawing from trustworthy medical sources like Mayo Clinic, the American Academy of Dermatology (AAD), and peer-reviewed literature.
- You support users in identifying possible causes, risk factors, and next steps for common dermatological issues such as acne, rosacea, eczema, psoriasis, hair loss, and other skin conditions.
- You offer guidance on treatment options (topical agents, systemic treatments, lifestyle changes) **strictly for informational purposes**, reminding users that your advice should never replace consultation with a licensed healthcare provider.
- You personalize your responses based on user profile data: age, gender, ethnicity, medical history, and lifestyle factors—always using inclusive, sensitive language.
- You educate users on preventive skincare, sun protection, and healthy habits to support long-term skin wellness.
- You do **not** diagnose, prescribe, or claim medical authority; instead, you act as a supportive, AI-driven health companion.
- You remind the user of the image analysis feature, which can help identify skin conditions from images.
Always communicate in a professional yet friendly tone, with empathy and clarity.
When relevant, mention reliable sources, explain medical terms in plain language, and encourage users to follow up with certified dermatologists for proper assessment.

Remember: your purpose is to **empower, inform, and reassure**—never to replace qualified medical care.
"""
os.environ["GOOGLE_API_KEY"] = "AIzaSyDTOmczCP_8m-C-XhFJDoLPVudIq3xg7uY"
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

urls = [
    "https://www.aad.org/public/diseases/rosacea/what-is/skin-color",
    "https://www.aad.org/public/diseases/rosacea/triggers/prevent",
    "https://www.mayoclinic.org/diseases-conditions/acne/diagnosis-treatment/drc-20368048",
    "https://www.mayoclinic.org/diseases-conditions/acne/expert-answers/acne-scars/faq-20058101",
    "https://www.aad.org/public/diseases/rosacea/treatment/diagnosis-treat"
]

texts = [crawl_page(url) for url in urls]

text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)

documents = text_splitter.create_documents(texts)
vectorstore = Chroma.from_documents(documents, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

def medical_rag(query: str) -> str:
    """Search trusted dermatology sources and return relevant information."""
    results = retriever.get_relevant_documents(query)
    summaries = "\n".join([doc.page_content for doc in results])
    return f"Here’s what trusted sources say:\n{summaries}"

def dummy_tool(input):
    return systemMessage


agent = initialize_agent(
    tools=[
        Tool(            name="ai_chatbot",
            func=dummy_tool,
            description=(str(systemMessage)),
        ),
        Tool(
            name="medical_rag",
            func=medical_rag,
            description="Search trusted dermatology sources and return relevant information.")
    ],
    llm=llm,
    agent_type=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    verbose=True,
    system_message=systemMessage
)

# while True:
#     user_input = input("You: ")
#     if user_input.lower() in ["exit", "quit"]:
#         break
#     response = agent({"input": user_input})
#     print(f"DermAI: {response['output']}")