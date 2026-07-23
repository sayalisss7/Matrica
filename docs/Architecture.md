# Matrica Architecture

## Overall System Architecture
```mermaid
graph TD
    User([User]) --> Frontend(React App);
    Frontend --> Backend_API(FastAPI Server);
    Backend_API --> Task_Router(Langchain Router);
    
    Task_Router --> Intent_Agent(Intent Classifier);
    Intent_Agent -->|SQL Needed| SQL_Agent;
    Intent_Agent -->|Context Needed| RAG_Agent;
    
    SQL_Agent-->|Executes Query| Postgres_DB(Gold Star Schema);
    RAG_Agent-->|Semantic Search| ChromaDB(Vector Store);
    
    Postgres_DB-->Context_Fusion;
    ChromaDB-->Context_Fusion;
    
    Context_Fusion-->|Final Generation| Gemini(LLM);
    Gemini-->Backend_API;

    subgraph Data Pipeline
    Raw_Data-->Bronze_Layer;
    Bronze_Layer-->|Clean| Silver_Layer;
    Silver_Layer-->|Star Schema| Gold_Layer;
    Gold_Layer-->|Star Schema Loads| Postgres_DB;
    end
```

## Data Engineering Pipeline (Medallion)
```mermaid
graph LR;
    Raw_CSVs-->|Databricks| Bronze_Layer;
    Bronze_Layer-->|Clean & Validate| Silver_Layer;
    Silver_Layer-->|Feature Engineering| Gold_Layer;
    Gold_Layer-->|Star Schema Loads| Postgres_DB;
```
