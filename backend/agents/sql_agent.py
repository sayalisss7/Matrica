import os
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_groq import ChatGroq

# Load .env from the project root
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(base_dir, ".env"))

def get_sql_agent():
    # Fetch PostgreSQL connection string
    db_uri = os.getenv("DATABASE_URL")
    
    if not db_uri:
        raise ValueError("DATABASE_URL environment variable is missing. Neon PostgreSQL configuration is required.")

    db = SQLDatabase.from_uri(db_uri)
    
    # We use Groq exclusively
    llm = ChatGroq(model=os.getenv("GROQ_MODEL"), temperature=0)
    
    agent_executor = create_sql_agent(
        llm=llm,
        toolkit=None,  
        db=db,
        agent_type="openai-tools", 
        verbose=True
    )
    return agent_executor

def run_sql_query(query: str) -> str:
    agent = get_sql_agent()
    if not agent:
        return "Database not found or not initialized."
    try:
        enhanced_query = f"INSTRUCTION: When filtering by string columns like tournament, map, or player names, ALWAYS use ILIKE '%...%' and extract just the most unique keyword (e.g. use '%Americas%' instead of '%VCT Americas%') to avoid empty results. User Query: {query}"
        response = agent.invoke({"input": enhanced_query})
        return response.get("output", str(response))
    except Exception as e:
        return f"Error executing SQL query: {e}"
