import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

db_uri = os.getenv("DATABASE_URL")
if not db_uri:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

print(f"Connecting to database...")
engine = create_engine(db_uri)

sql_path = r"c:\Users\Sayali\Desktop\vct_2025\data_pipeline\sql\05_create_sponsorship_tables.sql"
print(f"Reading SQL from {sql_path}...")
with open(sql_path, "r") as f:
    sql = f.read()

try:
    with engine.begin() as conn:
        conn.execute(text(sql))
    print("Successfully applied SQL migration!")
except Exception as e:
    print(f"Error applying migration: {e}")
