from __future__ import annotations

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator

DEFAULT_ARGS = {
    "owner": "data-engineering",
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="rag_document_ingestion_pipeline",
    description="Automates document ingestion, chunking, embedding, and vector indexing for a RAG system.",
    default_args=DEFAULT_ARGS,
    start_date=datetime(2026, 1, 1),
    schedule="@daily",
    catchup=False,
    tags=["rag", "vector-db", "data-engineering"],
) as dag:

    validate_documents = BashOperator(
        task_id="validate_raw_documents",
        bash_command="python scripts/validate_documents.py",
    )

    ingest_to_vector_db = BashOperator(
        task_id="ingest_documents_to_chromadb",
        bash_command="python -m app.ingest",
    )

    validate_documents >> ingest_to_vector_db
