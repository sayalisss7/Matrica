import os
import pandas as pd
import sqlite3

def load_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, 'database', 'matrica.db')
    
    # Ensure database directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    
    # Define mapping of directories to table names
    csv_mappings = {
        'agents/agents_pick_rates.csv': 'fact_agents_pick_rates',
        'agents/maps_stats.csv': 'fact_maps_stats',
        'agents/teams_picked_agents.csv': 'fact_teams_picked_agents',
        'ids/players_ids.csv': 'dim_players',
        'ids/teams_ids.csv': 'dim_teams',
        'ids/tournaments_stages_match_types_ids.csv': 'dim_tournaments',
        'ids/tournaments_stages_matches_games_ids.csv': 'dim_matches_games',
        'matches/draft_phase.csv': 'fact_draft_phase',
        'matches/eco_rounds.csv': 'fact_eco_rounds',
        'matches/eco_stats.csv': 'fact_eco_stats',
        'matches/kills.csv': 'fact_kills',
        'matches/kills_stats.csv': 'fact_kills_stats',
        'matches/maps_played.csv': 'fact_maps_played',
        'matches/maps_scores.csv': 'fact_maps_scores',
        'matches/overview.csv': 'fact_matches',
        'matches/rounds_kills.csv': 'fact_rounds_kills',
        'matches/scores.csv': 'fact_scores',
        'matches/team_mapping.csv': 'dim_team_mapping',
        'matches/win_loss_methods_count.csv': 'fact_win_loss_methods_count',
        'matches/win_loss_methods_round_number.csv': 'fact_win_loss_methods_round_number',
        'players_stats/players_stats.csv': 'fact_player_stats'
    }
    
    for rel_path, table_name in csv_mappings.items():
        csv_path = os.path.join(base_dir, rel_path)
        if os.path.exists(csv_path):
            print(f"Loading {csv_path} into table {table_name}...")
            try:
                df = pd.read_csv(csv_path)
                
                # Standardize column names
                df.columns = [c.lower().replace(' ', '_').replace(':', '_').replace('%', 'pct').replace('-', 'minus').replace(',', '').replace('(', '').replace(')', '').replace('/', '_') for c in df.columns]
                
                df.to_sql(table_name, conn, if_exists='replace', index=False)
            except Exception as e:
                print(f"Error loading {csv_path}: {e}")
        else:
            print(f"Warning: {csv_path} not found.")

    conn.close()
    print(f"Database successfully created at {db_path}")

if __name__ == '__main__':
    load_data()
