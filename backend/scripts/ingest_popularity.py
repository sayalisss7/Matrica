import os
import csv
import psycopg2
from dotenv import load_dotenv

# Load .env
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(base_dir, ".env"), override=True)
db_uri = os.getenv("DATABASE_URL")
if db_uri:
    db_uri = db_uri.replace('&channel_binding=require', '')

csv_path = os.path.join(base_dir, "data", "gold", "popularity_analysis.csv")

def main():
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return

    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        if not rows:
            print("CSV is empty.")
            return

    # Create the table in PostgreSQL
    print("Connecting to database...")
    try:
        conn = psycopg2.connect(db_uri)
        cur = conn.cursor()
        
        print("Dropping existing table if it exists...")
        cur.execute("DROP TABLE IF EXISTS dim_player_popularity;")
        
        print("Creating table dim_player_popularity...")
        cur.execute("""
            CREATE TABLE dim_player_popularity (
                player_name VARCHAR(255) PRIMARY KEY,
                popularity FLOAT,
                reputation FLOAT,
                videos_found INT,
                total_views BIGINT,
                average_engagement FLOAT,
                comment_count INT,
                article_count INT
            );
        """)
        
        # Insert data
        print(f"Inserting {len(rows)} rows...")
        insert_query = """
            INSERT INTO dim_player_popularity (
                player_name, popularity, reputation, videos_found, 
                total_views, average_engagement, comment_count, article_count
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s
            )
        """
        
        for row in rows:
            vals = list(row.values())
            try:
                cur.execute(insert_query, (
                    vals[0].strip() if vals[0] else "",
                    float(vals[1]) if vals[1] else 0.0,
                    float(vals[2]) if vals[2] else 0.0,
                    int(vals[3]) if vals[3] else 0,
                    int(vals[4]) if vals[4] else 0,
                    float(vals[5]) if vals[5] else 0.0,
                    int(vals[6]) if vals[6] else 0,
                    int(vals[7]) if vals[7] else 0
                ))
            except Exception as e:
                print(f"Error inserting row {vals[0]}: {e}")
        
        conn.commit()
        cur.close()
        conn.close()
        print("Data successfully uploaded to dim_player_popularity!")
        
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    main()
