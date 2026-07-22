import sqlite3
import os
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

# Intent classifier prompt
INTENT_PROMPT = """
You are an expert esports analyst. Given the user query, classify the intent into ONE of the following categories:
- PLAYER (Stats about a specific player)
- TEAM (Stats about a specific team)
- TOURNAMENT (Information about tournaments, matches, maps)
- SPONSOR (Questions regarding brand alignment, sponsorship opportunities, or marketing value)
- NEWS (Qualitative information from news articles, recent events)
- GENERAL (General analytics or comparison not fitting above)

Query: {query}
Intent (only output the category name in uppercase):
"""

def get_llm():
    # We will use Gemini Flash 1.5 as requested by user
    # Or fallback to an open-source model if Google API is missing
    # Assuming user provides API key via dotenv
    return ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

def classify_intent(query: str) -> str:
    llm = get_llm()
    prompt = PromptTemplate(template=INTENT_PROMPT, input_variables=["query"])
    chain = prompt | llm
    result = chain.invoke({"query": query})
    return result.content.strip().upper()
