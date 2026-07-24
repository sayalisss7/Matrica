import os
import json
from dotenv import load_dotenv
from langchain_community.document_loaders import JSONLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

# Setup paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

chroma_dir = os.path.join(base_dir, "chromadb")
json_path = os.path.join(base_dir, "articles", "valorant_player_news_2025.json")

def ingest_articles_to_chroma():
    print(f"Reading JSON from {json_path}...")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if isinstance(data, dict) and "articles" in data:
        data = data["articles"]
        
    documents = []
    for item in data:
        # Create a Langchain Document for each article
        content = item.get("content", "")
        doc = Document(
            page_content=content,
            metadata={
                "title": item.get("title", ""),
                "date": item.get("date", ""),
                "source": item.get("source", ""),
                "url": item.get("article_url", ""),
                "players": ",".join(item.get("title_matched_players", []))
            }
        )
        documents.append(doc)

    print(f"Loaded {len(documents)} articles. Splitting text...")
    
    # Split text into chunks so the LLM can read it efficiently
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    
    print(f"Created {len(chunks)} text chunks. Generating embeddings...")
    
    # Using HuggingFace embeddings (free and fast)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Create or update ChromaDB
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=chroma_dir,
        collection_name="valorant_news"
    )
    
    print(f"Success! {len(chunks)} chunks saved to ChromaDB at {chroma_dir}")

if __name__ == "__main__":
    ingest_articles_to_chroma()
