from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from app.config import settings
from app.document_loader import load_documents


def ingest_documents() -> dict:
    """Ingest raw documents, split into chunks, embed, and persist in ChromaDB."""
    documents = load_documents(settings.raw_data_dir)
    if not documents:
        return {"status": "no_documents", "chunks_indexed": 0}

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
    chunks = splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(model_name=settings.embedding_model)
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=settings.collection_name,
        persist_directory=settings.chroma_persist_dir,
    )
    vector_db.persist()

    return {"status": "success", "documents_loaded": len(documents), "chunks_indexed": len(chunks)}


if __name__ == "__main__":
    print(ingest_documents())
