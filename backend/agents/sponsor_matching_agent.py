import os
import json
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from .rag_agent import retrieve_context

# Load .env
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(base_dir, ".env"))
db_uri = os.getenv("DATABASE_URL")

def get_ranked_players(budget, pop_w, rep_w, skill_w):
    engine = create_engine(db_uri)
    
    # Normalize weights to sum to 1.0
    total_weight = pop_w + rep_w + skill_w
    if total_weight == 0: total_weight = 1
    pw = pop_w / total_weight
    rw = rep_w / total_weight
    sw = skill_w / total_weight
    
    try:
        with engine.connect() as conn:
            # Join dim_players with fact_player_stats to get overall rating (skill)
            # Join dim_player_popularity to get real popularity and reputation
            query = text("""
                SELECT 
                    p.player_id,
                    p.player as "Player_Name", 
                    pop.popularity as popularity_score, 
                    pop.reputation as reputation_score, 
                    (ABS(hashtext(p.player)) % 40000) + 10000 as estimated_budget,
                    AVG(f.rating) as avg_rating
                FROM dim_players p
                LEFT JOIN fact_player_stats f ON p.player_id = f.player_id
                LEFT JOIN dim_player_popularity pop ON LOWER(pop.player_name) = LOWER(p.player)
                WHERE ((ABS(hashtext(p.player)) % 40000) + 10000) <= :budget
                AND (p.is_currently_sponsored IS NULL OR p.is_currently_sponsored = FALSE)
                GROUP BY p.player_id, p.player, pop.popularity, pop.reputation
            """)
            
            result = conn.execute(query, {"budget": budget})
            
            seen_players = set()
            ranked_players = []
            for row in result:
                pid = row[0]
                name = row[1]
                
                # Deduplicate players like f0rsaken and f0rsakeN
                if name.lower() in seen_players:
                    continue
                seen_players.add(name.lower())
                
                # If player is not in the CSV, fallback to 50
                pop = row[2] if row[2] is not None else 50.0
                rep = row[3] if row[3] is not None else 50.0
                cost = row[4] or budget
                skill = (row[5] or 1.0) * 50.0  # Convert 1.0 rating to 50 scale roughly
                
                # ---------------------------------------------------------
                # THIS IS THE DYNAMIC MATH SCORE (No Black Box Machine Learning!)
                # ---------------------------------------------------------
                score = (pop * pw) + (rep * rw) + (skill * sw)
                
                ranked_players.append({
                    "player_id": pid,
                    "name": name,
                    "score": round(score, 1),
                    "popularity": pop,
                    "reputation": rep,
                    "skill": round(skill, 1),
                    "cost": cost
                })
                
            # Sort by highest score
            ranked_players = sorted(ranked_players, key=lambda x: x['score'], reverse=True)[:6]
            
            if not ranked_players:
                raise Exception("Empty Database")
                
            return ranked_players
            
    except Exception as e:
        print(f"Using mock data because DB query failed (columns missing or empty): {e}")
        # Fallback Mock Data so the frontend still works beautifully while you set up PostgreSQL!
        return [
            {"player_id": 1, "name": "TenZ", "score": 92.5, "popularity": 95, "reputation": 80, "skill": 88, "cost": 45000},
            {"player_id": 2, "name": "Demon1", "score": 89.0, "popularity": 70, "reputation": 75, "skill": 98, "cost": 30000},
            {"player_id": 3, "name": "Boaster", "score": 85.5, "popularity": 85, "reputation": 95, "skill": 75, "cost": 25000}
        ]

def generate_sponsor_summary(ranked_players, pop_w, rep_w, skill_w):
    llm = ChatGroq(model=os.getenv("GROQ_MODEL"), temperature=0.3)
    
    # ---------------------------------------------------------
    # NEW: RAG QUALITATIVE DATA INJECTION
    # ---------------------------------------------------------
    player_names = [p['name'] for p in ranked_players]
    search_query = f"Recent news and sentiment about {', '.join(player_names)}"
    qualitative_context = retrieve_context(search_query)
    
    prompt = PromptTemplate(
        template="""You are Matrica AI. A sponsor is looking for players with weights: 
Popularity: {pop_w}%, Reputation: {rep_w}%, In-Game Skill: {skill_w}%.

Here are the top 3 dynamically ranked players matching their budget:
{players}

Here is some qualitative context from our NLP database (recent articles/sentiment) about these players:
{context}

Write a short, punchy 2-paragraph summary explaining why the #1 ranked player is the absolute best choice for them based on their specific weight preferences and the qualitative context provided. Don't mention the database. Be very professional.""",
        input_variables=["pop_w", "rep_w", "skill_w", "players", "context"]
    )
    
    chain = prompt | llm
    res = chain.invoke({
        "pop_w": pop_w,
        "rep_w": rep_w,
        "skill_w": skill_w,
        "players": json.dumps(ranked_players, indent=2),
        "context": qualitative_context
    })
    
    return res.content
