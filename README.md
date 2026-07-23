# Matrica - AI Powered Esports Sponsorship Intelligence Platform

Matrica is an enterprise-grade esports analytics platform designed to analyze Valorant esports data, answer natural language questions, combine structured match statistics with qualitative news, and recommend sponsorship opportunities.

## Features
- **Medallion Architecture**: Processes raw esports data into a structured Star Schema in PostgreSQL.
- **RAG Architecture**: Vectorizes news articles using ChromaDB for semantic search.
- **Agentic Backend**: Langchain router dynamically decides whether to query PostgreSQL (stats) or ChromaDB (news) based on user intent.
- **Modern UI**: React + Tailwind frontend for dashboarding and chatting.

## Getting Started

### 1. Clone the repo
```bash
git clone <repo-url>
cd matrica
```

### 2. Backend Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the root with:
```env
GOOGLE_API_KEY="your-gemini-key"
GROQ_API_KEY="your-groq-key"
DATABASE_URL="your-neon-postgres-url"
```

### 4. Data Pipeline
Run the ETL script to load Gold data into PostgreSQL:
```bash
python data_pipeline/scripts/load_gold_postgres.py
```
Run the RAG ingestion to load articles into ChromaDB:
```bash
python rag/ingest.py
```

### 5. Run the Backend (FastAPI)
```bash
uvicorn backend.main:app --reload --port 8000
```

### 6. Run the Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Architecture
See `docs/Architecture.md` for full architecture diagrams.
