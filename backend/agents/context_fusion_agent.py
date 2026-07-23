from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

FUSION_PROMPT = """
You are Matrica, an AI-powered Esports Sponsorship Intelligence assistant. 

User Query: {query}

Database Results:
{sql_results}

News/Qualitative Context:
{rag_context}

Based on the information above, provide a highly concise and professional answer. 
CRITICAL INSTRUCTIONS:
1. DO NOT write long paragraphs. 
2. Use bolding and bullet points to make the answer easy to read.
3. If the user asks about sponsorships, split your answer into two clear sections: "Performance Stats" (using Database Results) and "Brand Momentum" (using News Context).
4. Do NOT mention "I retrieved this from a database".
"""

import os
from langchain_groq import ChatGroq

def fuse_context_and_generate(query: str, sql_results: str, rag_context: str) -> str:
    llm = ChatGroq(model=os.getenv("GROQ_MODEL"), temperature=0.3)
    prompt = PromptTemplate(template=FUSION_PROMPT, input_variables=["query", "sql_results", "rag_context"])
    chain = prompt | llm
    
    response = chain.invoke({
        "query": query,
        "sql_results": sql_results,
        "rag_context": rag_context
    })
    return response.content
