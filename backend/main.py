import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from backend.agents.task_router import handle_query

app = FastAPI(title="Matrica API", description="AI Powered Esports Sponsorship Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    context_used: list = []

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Matrica API is running."}

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    # Pass the query to our LangChain Task Router
    result = handle_query(request.query)
    return ChatResponse(answer=result.get("answer"), context_used=result.get("context_used", []))

# Additional endpoints for dashboard data would go here
# e.g., /api/players, /api/teams, /api/tournaments

class MatchRequest(BaseModel):
    budget: float
    popWeight: float
    repWeight: float
    skillWeight: float

@app.post("/api/match_sponsor")
def match_sponsor_endpoint(request: MatchRequest):
    from backend.agents.sponsor_matching_agent import get_ranked_players, generate_sponsor_summary
    
    # 1. Get dynamically ranked players
    players = get_ranked_players(
        request.budget, 
        request.popWeight, 
        request.repWeight, 
        request.skillWeight
    )
    
    # 2. Get LLM Summary
    summary = generate_sponsor_summary(
        players, 
        request.popWeight, 
        request.repWeight, 
        request.skillWeight
    )
    
    return {
        "players": players,
        "summary": summary
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
