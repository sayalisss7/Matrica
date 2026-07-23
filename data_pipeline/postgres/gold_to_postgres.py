import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine

# Load Environment Variables
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(base_dir, ".env"))

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise ValueError("DATABASE_URL not found in .env")

# Ensure it uses postgresql:// and requires ssl
if "sslmode=require" not in DB_URL:
    if "?" in DB_URL:
        DB_URL += "&sslmode=require"
    else:
        DB_URL += "?sslmode=require"

print("Connecting to Neon PostgreSQL...")
engine = create_engine(DB_URL)

GOLD = os.path.join(base_dir, "data", "gold")
tables = [
    "dim_players",
    "dim_agents",
    "dim_teams",
    "dim_maps",
    "dim_tournaments",
    "fact_player_stats",
    "fact_matches"
]

for table_name in tables:
    path = os.path.join(GOLD, table_name, "data.parquet")
    if not os.path.exists(path):
        print(f"Skipping {table_name}: File not found at {path}")
        continue
    
    print(f"Reading {table_name}...")
    df = pd.read_parquet(path)
    
    # Write to postgres
    print(f"Exporting {table_name} to PostgreSQL...")
    df.to_sql(table_name, engine, if_exists='replace', index=False)
    print(f"Successfully exported {table_name} ({len(df)} rows)")

print("=" * 80)
print("ALL GOLD TABLES EXPORTED TO POSTGRESQL SUCCESSFULLY!")
print("=" * 80)
