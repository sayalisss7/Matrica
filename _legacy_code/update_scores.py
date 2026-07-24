import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Setup path and env
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

db_uri = os.getenv("DATABASE_URL")
engine = create_engine(db_uri)

csv_path = os.path.join(base_dir, "notebooks", "analytics_outputs", "player_popularity_reputation_2025.csv")

def update_scores():
    print(f"Reading {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Could not read CSV: {e}")
        return

    print("Updating database...")
    with engine.connect() as conn:
        # Add columns if they don't exist
        conn.execute(text("ALTER TABLE dim_players ADD COLUMN IF NOT EXISTS popularity_score FLOAT;"))
        conn.execute(text("ALTER TABLE dim_players ADD COLUMN IF NOT EXISTS reputation_score FLOAT;"))
        conn.execute(text("ALTER TABLE dim_players ADD COLUMN IF NOT EXISTS estimated_budget FLOAT;"))
        
        for index, row in df.iterrows():
            player = row['player_name']
            pop = row['popularity_score']
            rep = row['reputation_score']
            
            # Using ILIKE for case-insensitive matching
            query = text("""
                UPDATE dim_players 
                SET popularity_score = :pop, reputation_score = :rep 
                WHERE "Player_Name" ILIKE :player
            """)
            conn.execute(query, {"pop": pop, "rep": rep, "player": f"%{player}%"})
            print(f"Updated {player} -> Pop: {pop}, Rep: {rep}")
            
        conn.commit()
    print("Database updated successfully!")

if __name__ == "__main__":
    update_scores()
