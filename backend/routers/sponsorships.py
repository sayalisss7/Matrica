from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from sqlalchemy import create_engine, text

router = APIRouter()

# Get DB Engine (Assuming similar setup to main.py)
def get_db_connection():
    db_uri = os.getenv("DATABASE_URL")
    if not db_uri:
        raise HTTPException(status_code=500, detail="Database URL not configured")
    engine = create_engine(db_uri)
    return engine

class ProposalCreate(BaseModel):
    brand_id: int
    duration_id: int
    actual_offer_amount: float
    meeting_datetime: datetime
    proposal_message: str

class ProposalModify(BaseModel):
    duration_id: int
    actual_offer_amount: float
    proposal_message: str

@router.get("/durations")
def get_sponsorship_durations():
    """Fetch all available sponsorship durations and multipliers."""
    engine = get_db_connection()
    try:
        with engine.connect() as conn:
            query = text("SELECT duration_id, name, duration_days, min_cost_multiplier, max_cost_multiplier FROM sponsorship_durations")
            result = conn.execute(query)
            durations = []
            for row in result:
                durations.append({
                    "duration_id": row[0],
                    "name": row[1],
                    "duration_days": row[2],
                    "min_multiplier": float(row[3]) if row[3] else 1.0,
                    "max_multiplier": float(row[4]) if row[4] else 1.0
                })
            return durations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/players/{player_id}/budget-range")
def get_budget_range(player_id: int, duration_id: int):
    """Calculate the budget range for a specific player and duration."""
    engine = get_db_connection()
    try:
        with engine.connect() as conn:
            # Get player's base value
            player_query = text("SELECT base_monthly_value FROM dim_players WHERE player_id = :pid")
            player_result = conn.execute(player_query, {"pid": player_id}).fetchone()
            if not player_result:
                raise HTTPException(status_code=404, detail="Player not found")
            
            base_value = float(player_result[0]) if player_result[0] else 5000.00
            
            # Get duration multipliers
            dur_query = text("SELECT min_cost_multiplier, max_cost_multiplier FROM sponsorship_durations WHERE duration_id = :did")
            dur_result = conn.execute(dur_query, {"did": duration_id}).fetchone()
            if not dur_result:
                raise HTTPException(status_code=404, detail="Duration not found")
                
            min_mult = float(dur_result[0])
            max_mult = float(dur_result[1])
            
            return {
                "min_budget": round(base_value * min_mult, 2),
                "max_budget": round(base_value * max_mult, 2),
                "base_value": base_value
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/players/{player_id}/proposals")
def submit_proposal(player_id: int, proposal: ProposalCreate):
    """Brand submits a new sponsorship proposal (Mock Calendar Booking)."""
    engine = get_db_connection()
    try:
        with engine.begin() as conn: # using begin() for transaction
            # Check if player is already sponsored
            check_query = text("SELECT is_currently_sponsored FROM dim_players WHERE player_id = :pid")
            is_locked = conn.execute(check_query, {"pid": player_id}).scalar()
            
            if is_locked:
                raise HTTPException(status_code=400, detail="Player is currently sponsored by another brand.")

            insert_query = text("""
                INSERT INTO sponsorship_proposals 
                (brand_id, player_id, current_duration_id, actual_offer_amount, meeting_datetime, proposal_message, status)
                VALUES (:bid, :pid, :did, :amt, :mtg, :msg, 'PENDING_PLAYER_REVIEW')
                RETURNING proposal_id
            """)
            result = conn.execute(insert_query, {
                "bid": proposal.brand_id,
                "pid": player_id,
                "did": proposal.duration_id,
                "amt": proposal.actual_offer_amount,
                "mtg": proposal.meeting_datetime,
                "msg": proposal.proposal_message
            })
            proposal_id = result.scalar()
            
            # Here is where the Google Calendar Agent would run:
            # meet_link = calendar_agent.book_sponsorship_meeting(...)
            
            return {"status": "success", "proposal_id": proposal_id, "message": "Proposal submitted and meeting booked."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/proposals/{proposal_id}/accept")
def accept_proposal(proposal_id: int):
    """Player or Brand accepts the proposal, locking the player."""
    engine = get_db_connection()
    try:
        with engine.begin() as conn: # Transaction block
            # 1. Get proposal details
            prop_query = text("SELECT player_id, brand_id FROM sponsorship_proposals WHERE proposal_id = :pid")
            prop_result = conn.execute(prop_query, {"pid": proposal_id}).fetchone()
            if not prop_result:
                raise HTTPException(status_code=404, detail="Proposal not found")
            
            player_id = prop_result[0]
            brand_id = prop_result[1]
            
            # 2. Mark this proposal as ACCEPTED
            update_prop = text("UPDATE sponsorship_proposals SET status = 'ACCEPTED' WHERE proposal_id = :pid")
            conn.execute(update_prop, {"pid": proposal_id})
            
            # 3. Lock the player
            lock_player = text("UPDATE dim_players SET is_currently_sponsored = TRUE, active_sponsor_brand_id = :bid WHERE player_id = :player_id")
            conn.execute(lock_player, {"bid": brand_id, "player_id": player_id})
            
            # 4. Auto-Decline all other pending proposals for this player
            auto_decline = text("""
                UPDATE sponsorship_proposals 
                SET status = 'AUTO_DECLINED_DUE_TO_EXCLUSIVITY' 
                WHERE player_id = :player_id AND proposal_id != :pid AND status LIKE 'PENDING%'
            """)
            conn.execute(auto_decline, {"player_id": player_id, "pid": proposal_id})
            
            return {"status": "success", "message": "Agreement finalized. Player is now locked."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ProposalGenerateRequest(BaseModel):
    player_name: str
    tone: str = "Professional"
    current_draft: str = ""

class ProposalScoreRequest(BaseModel):
    proposal_text: str
    player_name: str
    offer_amount: float = 0.0

class CalendarMatchRequest(BaseModel):
    duration_minutes: int = 30

from backend.agents.proposal_agent import generate_ai_proposal, score_proposal
from datetime import timedelta

@router.post("/players/{player_id}/generate-proposal")
def generate_proposal_endpoint(player_id: int, request: ProposalGenerateRequest):
    try:
        draft = generate_ai_proposal(request.player_name, request.tone, request.current_draft)
        return {"draft": draft}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/players/{player_id}/score-proposal")
def score_proposal_endpoint(player_id: int, request: ProposalScoreRequest):
    try:
        scores = score_proposal(request.proposal_text, request.player_name)
        return {"scores": scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/players/{player_id}/calendar-match")
def calendar_match_endpoint(player_id: int, request: CalendarMatchRequest):
    # Mock mutual availability
    now = datetime.now()
    # Simple labels for mock
    slots = [
        {"time": (now + timedelta(days=1)).replace(hour=16, minute=0, second=0).isoformat(), "label": "Tomorrow 4 PM"},
        {"time": (now + timedelta(days=2)).replace(hour=11, minute=0, second=0).isoformat(), "label": "Wednesday 11 AM"},
        {"time": (now + timedelta(days=4)).replace(hour=14, minute=0, second=0).isoformat(), "label": "Friday 2 PM"},
    ]
    return {"slots": slots}

class ProposalResponseRequest(BaseModel):
    action: str # 'REJECT' or 'COUNTER'
    message: str = ""

@router.get("/players/{player_id}/proposals")
def get_player_proposals(player_id: int):
    """Fetch all incoming proposals for a specific player."""
    engine = get_db_connection()
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT 
                    p.proposal_id, p.brand_id, p.actual_offer_amount, p.meeting_datetime, 
                    p.proposal_message, p.status, p.created_at,
                    d.name as duration_name, d.duration_days
                FROM sponsorship_proposals p
                JOIN sponsorship_durations d ON p.current_duration_id = d.duration_id
                WHERE p.player_id = :pid
                ORDER BY p.created_at DESC
            """)
            result = conn.execute(query, {"pid": player_id})
            proposals = []
            for row in result:
                proposals.append({
                    "proposal_id": row[0],
                    "brand_id": row[1],
                    "actual_offer_amount": float(row[2]) if row[2] else 0,
                    "meeting_datetime": row[3].isoformat() if row[3] else None,
                    "proposal_message": row[4],
                    "status": row[5],
                    "created_at": row[6].isoformat() if row[6] else None,
                    "duration_name": row[7],
                    "duration_days": row[8]
                })
            return proposals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/proposals/{proposal_id}/respond")
def respond_to_proposal(proposal_id: int, request: ProposalResponseRequest):
    """Player rejects or counter-offers a proposal."""
    engine = get_db_connection()
    try:
        with engine.begin() as conn:
            status = 'PLAYER_MODIFIED' if request.action == 'COUNTER' else 'DECLINED'
            # In a full app, we would append the counter message to a history table.
            # Here we just update the status (and optionally overwrite the message).
            update_query = text("""
                UPDATE sponsorship_proposals 
                SET status = :status
                WHERE proposal_id = :pid
            """)
            conn.execute(update_query, {"status": status, "pid": proposal_id})
            return {"status": "success", "new_status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
