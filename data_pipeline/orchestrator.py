import os
import subprocess
import time

def run_notebook(notebook_path):
    print(f"\n[{time.strftime('%H:%M:%S')}] Starting execution: {os.path.basename(notebook_path)}")
    start_time = time.time()
    
    # Run the notebook in place
    try:
        # Use python -m jupyter to ensure it uses the active venv
        result = subprocess.run([
            "python", "-m", "jupyter", "nbconvert", 
            "--execute", 
            "--to", "notebook", 
            "--inplace", 
            notebook_path
        ], capture_output=True, text=True, check=True)
        
        duration = time.time() - start_time
        print(f"[{time.strftime('%H:%M:%S')}] SUCCESS: {os.path.basename(notebook_path)} completed in {duration:.2f} seconds.")
        return True
    except subprocess.CalledProcessError as e:
        duration = time.time() - start_time
        print(f"[{time.strftime('%H:%M:%S')}] FAILED: {os.path.basename(notebook_path)} failed after {duration:.2f} seconds.")
        print(f"Error output:\n{e.stderr}")
        return False

def main():
    print("=" * 60)
    print("🚀 MATRICA ENTERPRISE DATA PIPELINE ORCHESTRATOR 🚀")
    print("=" * 60)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    notebook_dir = os.path.join(base_dir, 'notebooks')
    
    notebooks = [
        '01_bronze_to_silver_ids.ipynb',
        '02_bronze_to_silver_matches.ipynb',
        '03_bronze_to_silver_agents.ipynb',
        '04_bronze_to_silver_players.ipynb',
        '05_silver_to_gold.ipynb',
        '06_gold_to_postgres.ipynb'
    ]
    
    total_start = time.time()
    
    for nb in notebooks:
        nb_path = os.path.join(notebook_dir, nb)
        if not os.path.exists(nb_path):
            print(f"Error: Could not find notebook {nb_path}")
            return
            
        success = run_notebook(nb_path)
        if not success:
            print("\n❌ PIPELINE HALTED DUE TO ERROR.")
            return
            
    total_duration = time.time() - total_start
    
    print("\n" + "=" * 60)
    print("✅ PIPELINE EXECUTION COMPLETE")
    print("=" * 60)
    print(f"Total processing time: {total_duration:.2f} seconds.")
    print("All datasets processed, validated, and pushed to PostgreSQL.")
    print("=" * 60)

if __name__ == "__main__":
    main()
