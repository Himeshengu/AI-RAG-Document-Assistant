from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, Field
from pathlib import Path
import shutil

from app.config import settings
from app.ingest import ingest_documents
from app.retriever import semantic_search

app = FastAPI(title=settings.app_name)


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=2)
    top_k: int = Field(default=5, ge=1, le=20)


@app.get("/")
def health_check():
    return {"message": "RAG Data Pipeline API is running", "status": "healthy"}


@app.post("/upload")
def upload_document(file: UploadFile = File(...)):
    raw_path = Path(settings.raw_data_dir)
    raw_path.mkdir(parents=True, exist_ok=True)
    destination = raw_path / file.filename
    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "uploaded", "filename": file.filename}


@app.post("/ingest")
def run_ingestion():
    return ingest_documents()


@app.post("/search")
def search_documents(request: QueryRequest):
    return {"query": request.query, "results": semantic_search(request.query, request.top_k)}
