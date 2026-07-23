import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

def load_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    env_path = os.path.join(base_dir, ".env")
    load_dotenv(env_path)
    
    db_uri = os.getenv("DATABASE_URL")
    if not db_uri:
        raise ValueError("DATABASE_URL environment variable is missing.")
    
    engine = create_engine(db_uri)
    
    # Define mapping of directories to table names
    csv_mappings = {
        'data/bronze/agents/agents_pick_rates.csv': 'fact_agents_pick_rates',
        'data/bronze/agents/maps_stats.csv': 'fact_maps_stats',
        'data/bronze/agents/teams_picked_agents.csv': 'fact_teams_picked_agents',
        'data/bronze/ids/players_ids.csv': 'dim_players',
        'data/bronze/ids/teams_ids.csv': 'dim_teams',
        'data/bronze/ids/tournaments_stages_match_types_ids.csv': 'dim_tournaments',
        'data/bronze/ids/tournaments_stages_matches_games_ids.csv': 'dim_matches_games',
        'data/bronze/matches/draft_phase.csv': 'fact_draft_phase',
        'data/bronze/matches/eco_rounds.csv': 'fact_eco_rounds',
        'data/bronze/matches/eco_stats.csv': 'fact_eco_stats',
        'data/bronze/matches/kills.csv': 'fact_kills',
        'data/bronze/matches/kills_stats.csv': 'fact_kills_stats',
        'data/bronze/matches/maps_played.csv': 'fact_maps_played',
        'data/bronze/matches/maps_scores.csv': 'fact_maps_scores',
        'data/bronze/matches/overview.csv': 'fact_matches',
        'data/bronze/matches/rounds_kills.csv': 'fact_rounds_kills',
        'data/bronze/matches/scores.csv': 'fact_scores',
        'data/bronze/matches/team_mapping.csv': 'dim_team_mapping',
        'data/bronze/matches/win_loss_methods_count.csv': 'fact_win_loss_methods_count',
        'data/bronze/matches/win_loss_methods_round_number.csv': 'fact_win_loss_methods_round_number',
        'data/bronze/players_stats/players_stats.csv': 'fact_player_stats'
    }
    
    for rel_path, table_name in csv_mappings.items():
        csv_path = os.path.join(base_dir, rel_path)
        if os.path.exists(csv_path):
            print(f"Loading {csv_path} into table {table_name}...")
            try:
                df = pd.read_csv(csv_path)
                
                # Standardize column names
                df.columns = [c.lower().replace(' ', '_').replace(':', '_').replace('%', 'pct').replace('-', 'minus').replace(',', '').replace('(', '').replace(')', '').replace('/', '_') for c in df.columns]
                
                df.to_sql(table_name, engine, if_exists='replace', index=False)
            except Exception as e:
                print(f"Error loading {csv_path}: {e}")
        else:
            print(f"Warning: {csv_path} not found.")

    engine.dispose()
    print("Database successfully populated in PostgreSQL.")

if __name__ == '__main__':
    load_data()
