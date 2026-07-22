from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

FUSION_PROMPT = """
You are Matrica, an AI-powered Esports Sponsorship Intelligence assistant. 
You are given a user query, some data retrieved from a SQL database (quantitative), and some context retrieved from news articles (qualitative).

User Query: {query}

Database Results:
{sql_results}

News/Qualitative Context:
{rag_context}

Based on the information above, provide a comprehensive, professional, and well-structured answer. 
If the user asks about sponsorships, highlight brand alignment, demographics, and recent performance or news.
Do NOT mention "I retrieved this from a database". Just present the facts.
"""

def fuse_context_and_generate(query: str, sql_results: str, rag_context: str) -> str:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    prompt = PromptTemplate(template=FUSION_PROMPT, input_variables=["query", "sql_results", "rag_context"])
    chain = prompt | llm
    
    response = chain.invoke({
        "query": query,
        "sql_results": sql_results,
        "rag_context": rag_context
    })
    return response.content
