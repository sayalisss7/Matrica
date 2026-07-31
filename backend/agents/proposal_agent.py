import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

def generate_ai_proposal(player_name: str, tone: str, current_draft: str = "") -> str:
    llm = get_llm()
    
    if current_draft:
        prompt_str = f"""You are an expert esports sponsorship negotiator working on behalf of a BRAND.
The user (a Brand Representative) wants to refine an existing sponsorship proposal being sent TO the esports player {player_name}.
They requested the tone to be: {tone}.

Current Draft:
{current_draft}

Please rewrite the draft in the requested tone. Maintain the core message but adjust the vocabulary and style.
Always write from the perspective of the Brand offering the sponsorship TO the player. Address the player directly.
Return ONLY the rewritten proposal text, no conversational filler.
"""
    else:
        if not tone:
            tone = "Professional"
        prompt_str = f"""You are an expert esports sponsorship negotiator working on behalf of a BRAND. 
Generate a strong initial sponsorship proposal FROM your brand TO the esports player {player_name}. 
The requested tone is: {tone}.

Make it sound professional, mentioning their recent performances, consistency, and alignment with the brand vision. Propose a short meeting to discuss financial support and collaboration.
Address the player ({player_name}) directly (e.g., "Hello {player_name}"). Do NOT write it as if the player is offering themselves to a brand.
Return ONLY the proposal text, no conversational filler.
"""
    prompt = PromptTemplate(template=prompt_str, input_variables=[])
    chain = prompt | llm
    result = chain.invoke({})
    return result.content.strip()

def score_proposal(proposal_text: str, player_name: str) -> dict:
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"))
    prompt_str = f"""You are an AI scoring a sponsorship proposal for {player_name}.
Evaluate the following proposal and provide a score from 0 to 100 for each of the following categories:
- Proposal Strength
- Professionalism
- Clarity
- Negotiation
- Brand Alignment
- Chance of Positive Reply

Proposal:
{proposal_text}

Output ONLY valid JSON in the exact following format, with no extra text or markdown formatting:
{{
    "Proposal Strength": 90,
    "Professionalism": 95,
    "Clarity": 92,
    "Negotiation": 85,
    "Brand Alignment": 94,
    "Chance of Positive Reply": 80
}}
"""
    prompt = PromptTemplate(template=prompt_str, input_variables=[])
    chain = prompt | llm
    result = chain.invoke({})
    content = result.content.strip()
    if content.startswith("```json"):
        content = content[7:-3].strip()
    elif content.startswith("```"):
        content = content[3:-3].strip()
        
    try:
        return json.loads(content)
    except:
        return {
            "Proposal Strength": 85,
            "Professionalism": 90,
            "Clarity": 88,
            "Negotiation": 80,
            "Brand Alignment": 85,
            "Chance of Positive Reply": 75
        }
