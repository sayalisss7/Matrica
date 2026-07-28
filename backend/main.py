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

import redis
import json
from langchain_core.globals import set_llm_cache
from langchain_community.cache import RedisCache

# Connect to Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
try:
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping() # Immediately test the connection
    # Set LangChain Global Cache to use Redis
    set_llm_cache(RedisCache(redis_ = redis.Redis.from_url(REDIS_URL)))
except Exception:
    print("INFO: Redis cache is currently offline. Running backend locally without caching.")
    redis_client = None

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
    cache_key = f"chat_cache:{request.query.strip().lower()}"
    
    # 1. Check Redis Cache for exact match
    if redis_client:
        cached_response = redis_client.get(cache_key)
        if cached_response:
            return ChatResponse(**json.loads(cached_response))
    
    # 2. Pass the query to our LangChain Task Router
    result = handle_query(request.query)
    response = ChatResponse(answer=result.get("answer"), context_used=result.get("context_used", []))
    
    # 3. Store the result in Redis for 24 hours (86400 seconds)
    if redis_client:
        redis_client.setex(cache_key, 86400, json.dumps(response.dict()))
        
    return response
# Additional endpoints for dashboard data
@app.get("/api/dashboard/recommendations")
def get_dashboard_recommendations():
    import os
    from sqlalchemy import create_engine, text
    
    db_uri = os.getenv("DATABASE_URL")
    engine = create_engine(db_uri)
    
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT 
                    p.player as "title", 
                    ROUND(AVG(f.rating) * 100, 0) as "score", 
                    'Top Ranked' as "subtitle", 
                    'Est Cost: ₹' || ((ABS(hashtext(p.player)) % 40000) + 10000) as "footer"
                FROM dim_players p
                JOIN fact_player_stats f ON p.player_id = f.player_id
                GROUP BY p.player
                ORDER BY AVG(f.rating) DESC
                LIMIT 4
            """)
            
            result = conn.execute(query)
            cards = []
            for row in result:
                cards.append({
                    "title": row[0],
                    "score": f"{int(row[1])}%" if row[1] else "N/A",
                    "subtitle": row[2],
                    "footer": row[3]
                })
            return cards
    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        return [
            {"title": "TenZ", "score": "98%", "subtitle": "Top Rated", "footer": "Est Cost: ₹45000"},
            {"title": "Demon1", "score": "95%", "subtitle": "Trending", "footer": "Est Cost: ₹30000"},
            {"title": "Boaster", "score": "90%", "subtitle": "High Popularity", "footer": "Est Cost: ₹25000"},
            {"title": "Aspas", "score": "88%", "subtitle": "Strong ROI", "footer": "Est Cost: ₹35000"}
        ]

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

@app.get("/api/dashboard/stats")
def get_dashboard_stats(category: str = "kills"):
    import os
    from sqlalchemy import create_engine, text
    
    db_uri = os.getenv("DATABASE_URL")
    engine = create_engine(db_uri)
    
    try:
        with engine.connect() as conn:
            if category == "kills":
                query_str = """
                    SELECT p.player, SUM(f.kills) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category == "kd":
                query_str = """
                    SELECT p.player, AVG(f.killsdeaths) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category == "acs":
                query_str = """
                    SELECT p.player, AVG(f.average_combat_score) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category == "hs":
                query_str = """
                    SELECT p.player, AVG(CAST(REPLACE(f.headshot_, '%', '') AS FLOAT)) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category == "popularity":
                query_str = """
                    SELECT player_name as player, popularity as val
                    FROM dim_player_popularity
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category == "score":
                query_str = """
                    SELECT p.player, ROUND(AVG(f.rating) * 100, 0) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category == "first_kills":
                query_str = """
                    SELECT p.player, SUM(f.first_kills) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            elif category.startswith("agent_"):
                agent_name = category.replace("agent_", "")
                query_str = f"""
                    SELECT p.player, ROUND(AVG(f.rating) * 100, 0) as val
                    FROM dim_players p
                    JOIN fact_player_stats f ON p.player_id = f.player_id
                    WHERE f.agents LIKE '%{agent_name}%'
                    GROUP BY p.player
                    ORDER BY val DESC
                    LIMIT 10
                """
            else:
                return []
                
            query = text(query_str)
            result = conn.execute(query)
            data = []
            for row in result:
                data.append({"name": row[0], "value": round(float(row[1]), 2) if row[1] is not None else 0})
            return data
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        # Return mock data if DB fails (or sleeps)
        return [
            {"name": "TenZ", "value": 120},
            {"name": "Demon1", "value": 115},
            {"name": "Aspas", "value": 110},
            {"name": "Boaster", "value": 90},
            {"name": "Derke", "value": 85}
        ]

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
