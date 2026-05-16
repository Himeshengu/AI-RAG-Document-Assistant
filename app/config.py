from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "RAG Data Pipeline System"
    chroma_persist_dir: str = "./chroma_db"
    collection_name: str = "rag_documents"
    raw_data_dir: str = "./data/raw"
    processed_data_dir: str = "./data/processed"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    aws_region: str = "us-west-2"
    s3_bucket_name: str = "your-bucket-name"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
