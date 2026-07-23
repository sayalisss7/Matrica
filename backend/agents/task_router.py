from backend.agents.intent_agent import classify_intent
from backend.agents.sql_agent import run_sql_query
from backend.agents.rag_agent import retrieve_context
from backend.agents.context_fusion_agent import fuse_context_and_generate

def handle_query(query: str) -> dict:
    # 1. Classify Intent
    intent = classify_intent(query)
    
    sql_results = ""
    rag_context = ""
    context_used = []
    
    # 2. Route based on intent
    # If the question is about stats, players, teams, or tournaments, we definitely need SQL
    if intent in ["PLAYER", "TEAM", "TOURNAMENT", "GENERAL", "SPONSOR"]:
        sql_results = run_sql_query(query)
        context_used.append("SQL Database")
    
    # If the question is about news or sponsorships, we need qualitative data
    if intent in ["SPONSOR", "NEWS", "TEAM", "PLAYER"]:
        rag_context = retrieve_context(query)
        context_used.append("ChromaDB (News Articles)")
        
    # If we need both (like TEAM or PLAYER where we want stats + news)
    # The conditions above handle that.
    
    # 3. Fuse and Generate Response
    final_answer = fuse_context_and_generate(query, sql_results, rag_context)
    
    return {
        "answer": final_answer,
        "intent": intent,
        "context_used": context_used
    }
