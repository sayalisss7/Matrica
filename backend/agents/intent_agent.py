import os
import pandas as pd
from langchain_groq import ChatGroq
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

import os
from langchain_groq import ChatGroq

def get_llm():
    return ChatGroq(model=os.getenv("GROQ_MODEL"), temperature=0)

def classify_intent(query: str) -> str:
    llm = get_llm()
    prompt = PromptTemplate(template=INTENT_PROMPT, input_variables=["query"])
    chain = prompt | llm
    result = chain.invoke({"query": query})
    return result.content.strip().upper()
