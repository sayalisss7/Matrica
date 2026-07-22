# Matrica - AI Powered Esports Sponsorship Intelligence Platform

Matrica is an enterprise-grade esports analytics platform designed to analyze Valorant esports data, answer natural language questions, combine structured match statistics with qualitative news, and recommend sponsorship opportunities.

## Features
- **Medallion Architecture**: Processes raw esports data into a structured Star Schema in SQLite.
- **AI Chat & Agents**: Utilizes LangChain Agents (Intent, SQL, RAG, Context Fusion) powered by Gemini to answer complex natural language queries.
- **RAG Pipeline**: Ingests qualitative data (news, articles, interviews) into ChromaDB using Gemini embeddings.
- **Modern Dashboard**: A React frontend with TailwindCSS, Vite, Recharts, and Framer Motion providing a dark-mode, enterprise UI.

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Backend Setup
```bash
python -m venv venv
# Windows
.\venv\Scripts\Activate.ps1
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Data Ingestion
Run the ETL script to load Gold CSVs into the SQLite database:
```bash
python scripts/load_gold_sqlite.py
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
