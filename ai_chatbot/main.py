from fastapi import FastAPI
from pydantic import BaseModel
from final_chatbot import agent
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ⚠️ or ["http://localhost:3000/"] for your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str

@app.post("/chat")
async def chat(query: Query):
    response = agent({"input": query.message})
    return {"response": response}