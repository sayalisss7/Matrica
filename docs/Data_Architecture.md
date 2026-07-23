# Matrica Data Architecture Documentation

This document explains the technical rationale behind the Matrica Esports Intelligence Platform's data pipeline, detailing how unstructured and structured data flows through the system to power our AI agents.

## 1. Medallion Architecture (Databricks)

We implement a Medallion Architecture (Bronze -> Silver -> Gold) to ensure data quality, reliability, and incremental processing.

### Why Bronze Layer?
The Bronze layer stores the raw, untouched data exactly as it arrives from external sources (e.g., CSVs from scraping scripts, APIs). 
- **Purpose**: Provides a source of truth for replayability. If our downstream ETL logic changes or breaks, we can always reprocess the data from the Bronze layer without re-fetching it from the internet.

### Why Silver Layer?
The Silver layer contains filtered, cleaned, and augmented data.
- **Purpose**: This is where data quality happens. Nulls are imputed using context-aware window functions, text is standardized (e.g., lowercasing, stripping whitespace), string percentages are cast to decimals, and duplicate rows are dropped. It acts as an Enterprise Data Hub.

### Why Gold Layer?
The Gold layer contains business-level aggregates, structured specifically for reporting and AI querying.
- **Purpose**: Data is modeled into a Star Schema (Fact and Dimension tables), which is heavily optimized for fast analytical queries (OLAP) and easily understood by SQL agents.

## 2. Dimensional Modeling (Star Schema)

We organize the Gold layer using a Star Schema.

### How Dimension Tables Work
Dimension tables (e.g., `dim_players`, `dim_agents`, `dim_teams`) describe the "who, what, where, when, why, and how" of an event. They contain descriptive attributes (strings) and use surrogate primary keys (e.g., `Player_ID`).
- **Advantage**: Normalizes the data, removing redundancy and making filtering extremely fast.

### How Fact Tables Work
Fact tables (e.g., `fact_player_stats`, `fact_matches`) contain the measurable, quantitative data about a business event (e.g., a match being played). They contain foreign keys that link back to the Dimension tables, along with metrics like `Rating`, `Kills`, `ADR`, and `Clutches_Won`.
- **Advantage**: Fact tables are narrow and long. They scale massively and allow complex aggregations (SUM, AVG) across millions of rows with high performance.

## 3. PostgreSQL Integration

### Why PostgreSQL is Used
While Databricks is incredible for big data processing (OLAP), connecting an interactive, customer-facing web application or an LLM chatbot directly to a massive data warehouse can incur high latency and compute costs.
- **Purpose**: PostgreSQL acts as our high-performance Serving Layer (OLTP/Operational Data Store). It provides sub-second query latency for the LangChain SQL Agent and the React frontend.

### How Databricks Connects to PostgreSQL
Once the Gold tables are generated in Databricks, a PySpark notebook (`gold_to_postgres.py`) uses a JDBC connector to establish a secure connection to the PostgreSQL instance. It reads the Gold tables from the Databricks catalog and uses `overwrite` mode to push the curated data into PostgreSQL on a scheduled basis.

## 4. AI Agents Integration

### How LangChain SQL Agent uses PostgreSQL
The LangChain SQL Agent uses the PostgreSQL database as its tool. When a user asks a question like "Who are the top 10 players by KD ratio?", the Agent:
1. Reviews the Star Schema (Fact and Dimension tables) inside PostgreSQL.
2. Synthesizes a highly optimized SQL query (e.g., `SELECT p.Player_Name, SUM(f.Kills)/SUM(f.Deaths) AS KD...`).
3. Executes the query directly against PostgreSQL.
4. Returns the natural language answer to the user.

### How the RAG Pipeline uses Qualitative Data
Structured stats (Kills, Deaths) don't tell the whole story. The RAG (Retrieval-Augmented Generation) pipeline processes qualitative data like esports news articles, player interviews, and patch notes.
- **Process**: These documents are chunked and embedded (converted to vectors) using Google Generative AI Embeddings and stored in a vector database (ChromaDB).
- **Usage**: When a user asks "Why did TenZ struggle on map Lotus?", the system searches ChromaDB for relevant news snippets and passes them to the LLM as context, allowing it to fuse hard statistical facts (from PostgreSQL) with real-world context (from ChromaDB).
