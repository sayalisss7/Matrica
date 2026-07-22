import os
import glob
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def ingest_articles():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    articles_dir = os.path.join(base_dir, 'articles')
    chroma_dir = os.path.join(base_dir, 'chromadb')
    
    # Load all markdown files
    article_files = glob.glob(os.path.join(articles_dir, '*.md'))
    documents = []
    
    for file_path in article_files:
        loader = TextLoader(file_path, encoding='utf-8')
        documents.extend(loader.load())
        
    print(f"Loaded {len(documents)} articles.")
    
    # Chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")
    
    # Embeddings
    # Using the recommended model for embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    
    # Store in ChromaDB
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=chroma_dir,
        collection_name="esports_articles"
    )
    
    print(f"Ingestion complete. Vector store saved to {chroma_dir}")

if __name__ == "__main__":
    if not os.environ.get("GOOGLE_API_KEY"):
        print("WARNING: GOOGLE_API_KEY environment variable is not set. Please set it in .env file.")
    else:
        ingest_articles()
