import os
import json
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

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
            query = text("""
                SELECT p."Player_Name", p.popularity_score, p.reputation_score, p.estimated_budget,
                       AVG(f."Rating") as avg_rating
                FROM dim_players p
                LEFT JOIN fact_player_stats f ON p."Player_ID" = f."Player_ID"
                WHERE COALESCE(p.estimated_budget, 10000) <= :budget
                GROUP BY p."Player_Name", p.popularity_score, p.reputation_score, p.estimated_budget
            """)
            
            result = conn.execute(query, {"budget": budget})
            
            ranked_players = []
            for row in result:
                name = row[0]
                pop = row[1] or 50.0 
                rep = row[2] or 50.0
                cost = row[3] or budget
                skill = (row[4] or 1.0) * 50.0  # Convert 1.0 rating to 50 scale roughly
                
                # ---------------------------------------------------------
                # THIS IS THE DYNAMIC MATH SCORE (No Black Box Machine Learning!)
                # ---------------------------------------------------------
                score = (pop * pw) + (rep * rw) + (skill * sw)
                
                ranked_players.append({
                    "name": name,
                    "score": round(score, 1),
                    "popularity": pop,
                    "reputation": rep,
                    "skill": round(skill, 1),
                    "cost": cost
                })
                
            # Sort by highest score
            ranked_players = sorted(ranked_players, key=lambda x: x['score'], reverse=True)[:3]
            
            if not ranked_players:
                raise Exception("Empty Database")
                
            return ranked_players
            
    except Exception as e:
        print(f"Using mock data because DB query failed (columns missing or empty): {e}")
        # Fallback Mock Data so the frontend still works beautifully while you set up PostgreSQL!
        return [
            {"name": "TenZ", "score": 92.5, "popularity": 95, "reputation": 80, "skill": 88, "cost": 45000},
            {"name": "Demon1", "score": 89.0, "popularity": 70, "reputation": 75, "skill": 98, "cost": 30000},
            {"name": "Boaster", "score": 85.5, "popularity": 85, "reputation": 95, "skill": 75, "cost": 25000}
        ]

def generate_sponsor_summary(ranked_players, pop_w, rep_w, skill_w):
    llm = ChatGroq(model=os.getenv("GROQ_MODEL"), temperature=0.3)
    
    prompt = PromptTemplate(
        template="""You are Matrica AI. A sponsor is looking for players with weights: 
Popularity: {pop_w}%, Reputation: {rep_w}%, In-Game Skill: {skill_w}%.

Here are the top 3 dynamically ranked players matching their budget:
{players}

Write a short, punchy 2-paragraph summary explaining why the #1 ranked player is the absolute best choice for them based on their specific weight preferences. Don't mention the database. Be very professional.""",
        input_variables=["pop_w", "rep_w", "skill_w", "players"]
    )
    
    chain = prompt | llm
    res = chain.invoke({
        "pop_w": pop_w,
        "rep_w": rep_w,
        "skill_w": skill_w,
        "players": json.dumps(ranked_players, indent=2)
    })
    
    return res.content
