import os
import nbformat as nbf

def create_notebook():
    nb = nbf.v4.new_notebook()

    # Title & Setup
    nb.cells.append(nbf.v4.new_markdown_cell("# Matrica - Medallion Architecture Data Pipeline (PySpark)"))
    nb.cells.append(nbf.v4.new_markdown_cell("This notebook loads raw esports data, cleans it using PySpark (Bronze -> Silver), structures it into a Star Schema (Silver -> Gold), and finally exports the Gold tables to our SQLite database."))

    code_setup = """import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, trim, lower, when
import pandas as pd
import sqlite3

# Initialize Spark Session
spark = SparkSession.builder \\
    .appName("MatricaDataPipeline") \\
    .master("local[*]") \\
    .config("spark.driver.memory", "4g") \\
    .getOrCreate()

# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(''))
RAW_DIR = os.path.join(BASE_DIR, 'data', 'raw')
SILVER_DIR = os.path.join(BASE_DIR, 'data', 'silver')
GOLD_DIR = os.path.join(BASE_DIR, 'data', 'gold')
DB_PATH = os.path.join(BASE_DIR, 'database', 'matrica.db')

print("Spark Session Initialized!")"""
    nb.cells.append(nbf.v4.new_code_cell(code_setup))

    # Bronze Layer
    nb.cells.append(nbf.v4.new_markdown_cell("## 1. Bronze Layer (Raw Ingestion)\nRead the raw CSV files without modifications."))
    code_bronze = """# Read players and teams raw
players_raw_df = spark.read.csv(os.path.join(RAW_DIR, 'ids', 'players_ids.csv'), header=True, inferSchema=True)
teams_raw_df = spark.read.csv(os.path.join(RAW_DIR, 'ids', 'teams_ids.csv'), header=True, inferSchema=True)
matches_raw_df = spark.read.csv(os.path.join(RAW_DIR, 'matches', 'overview.csv'), header=True, inferSchema=True)

players_raw_df.show(5)"""
    nb.cells.append(nbf.v4.new_code_cell(code_bronze))

    # Silver Layer
    nb.cells.append(nbf.v4.new_markdown_cell("## 2. Silver Layer (Data Cleaning)\nStandardize column names, remove duplicates, handle nulls."))
    code_silver = """def clean_df(df):
    # Standardize column names (lowercase, replace spaces)
    for c in df.columns:
        new_c = c.lower().replace(' ', '_').replace(':', '_').replace('%', 'pct').replace('-', 'minus').replace(',', '').replace('(', '').replace(')', '').replace('/', '_')
        df = df.withColumnRenamed(c, new_c)
    
    # Drop full duplicates
    df = df.dropDuplicates()
    return df

players_silver_df = clean_df(players_raw_df)
teams_silver_df = clean_df(teams_raw_df)
matches_silver_df = clean_df(matches_raw_df)

# Save to Silver (Parquet format)
players_silver_df.write.mode("overwrite").parquet(os.path.join(SILVER_DIR, 'players'))
teams_silver_df.write.mode("overwrite").parquet(os.path.join(SILVER_DIR, 'teams'))
matches_silver_df.write.mode("overwrite").parquet(os.path.join(SILVER_DIR, 'matches'))

print("Silver layer processed and saved!")"""
    nb.cells.append(nbf.v4.new_code_cell(code_silver))

    # Gold Layer
    nb.cells.append(nbf.v4.new_markdown_cell("## 3. Gold Layer (Star Schema)\nCreate our dimension and fact tables for BI and AI Agents."))
    code_gold = """# Read back from Silver
players_silver = spark.read.parquet(os.path.join(SILVER_DIR, 'players'))
teams_silver = spark.read.parquet(os.path.join(SILVER_DIR, 'teams'))
matches_silver = spark.read.parquet(os.path.join(SILVER_DIR, 'matches'))

# Dimension Tables
dim_players = players_silver.select("player", "player_id").distinct()
dim_teams = teams_silver.select("team", "team_id").distinct()

# Fact Table (Matches)
# Select key metrics for the match fact table
fact_matches = matches_silver.select(
    "tournament", "stage", "match_type", "match_name", "map", "player", "team", "agents",
    "rating", "kills", "deaths", "assists", "average_damage_per_round", "side"
)

# Save Gold layer
dim_players.write.mode("overwrite").parquet(os.path.join(GOLD_DIR, 'dim_players'))
dim_teams.write.mode("overwrite").parquet(os.path.join(GOLD_DIR, 'dim_teams'))
fact_matches.write.mode("overwrite").parquet(os.path.join(GOLD_DIR, 'fact_matches'))

print("Gold layer processed and saved!")"""
    nb.cells.append(nbf.v4.new_code_cell(code_gold))

    # SQLite Load
    nb.cells.append(nbf.v4.new_markdown_cell("## 4. Final Destination (SQLite)\nLoad the Gold Parquet tables directly into the SQLite database for our backend FastAPI application."))
    code_sqlite = """# Helper function to read parquet with pandas and save to sqlite
def load_parquet_to_sqlite(parquet_path, table_name, db_path):
    if not os.path.exists(parquet_path):
        return
    df = pd.read_parquet(parquet_path)
    with sqlite3.connect(db_path) as conn:
        df.to_sql(table_name, conn, if_exists='replace', index=False)
    print(f"Loaded {len(df)} rows into {table_name}")

load_parquet_to_sqlite(os.path.join(GOLD_DIR, 'dim_players'), 'dim_players', DB_PATH)
load_parquet_to_sqlite(os.path.join(GOLD_DIR, 'dim_teams'), 'dim_teams', DB_PATH)
load_parquet_to_sqlite(os.path.join(GOLD_DIR, 'fact_matches'), 'fact_matches', DB_PATH)

print("Database load complete! The AI Agent is ready to query the database.")"""
    nb.cells.append(nbf.v4.new_code_cell(code_sqlite))

    # Stop Spark
    nb.cells.append(nbf.v4.new_code_cell("spark.stop()"))

    # Save Notebook
    notebook_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'notebooks', 'medallion_pipeline.ipynb')
    with open(notebook_path, 'w') as f:
        nbf.write(nb, f)
    
    print(f"Notebook successfully created at {notebook_path}")

if __name__ == "__main__":
    create_notebook()
