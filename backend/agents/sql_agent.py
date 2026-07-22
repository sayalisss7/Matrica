import os
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_google_genai import ChatGoogleGenerativeAI

def get_sql_agent():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, 'database', 'matrica.db')
    
    if not os.path.exists(db_path):
        return None

    db = SQLDatabase.from_uri(f"sqlite:///{db_path}")
    
    # We use Gemini for the SQL generation and execution
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    
    agent_executor = create_sql_agent(
        llm=llm,
        toolkit=None,  # Or use SQLDatabaseToolkit(db=db, llm=llm)
        db=db,
        agent_type="openai-tools", # Gemini supports this or we can use generic react
        verbose=True
    )
    return agent_executor

def run_sql_query(query: str) -> str:
    agent = get_sql_agent()
    if not agent:
        return "Database not found or not initialized."
    try:
        response = agent.invoke({"input": query})
        return response.get("output", str(response))
    except Exception as e:
        return f"Error executing SQL query: {e}"
