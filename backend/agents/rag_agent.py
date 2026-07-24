import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

def get_rag_retriever():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    chroma_dir = os.path.join(base_dir, 'chromadb')
    
    if not os.path.exists(chroma_dir):
        return None

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma(persist_directory=chroma_dir, embedding_function=embeddings, collection_name="valorant_news")
    return vectorstore.as_retriever(search_kwargs={"k": 3})

def retrieve_context(query: str) -> str:
    retriever = get_rag_retriever()
    if not retriever:
        return "No qualitative data found (ChromaDB not initialized)."
    
    try:
        docs = retriever.invoke(query)
        context = "\n\n".join([d.page_content for d in docs])
        return context
    except Exception as e:
        return f"Error retrieving context: {e}"
