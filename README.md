# Scalable RAG Data Pipeline System

A Data Engineering style Retrieval-Augmented Generation pipeline that automates document ingestion, chunking, embedding generation, vector indexing, and semantic search using **LangChain**, **ChromaDB**, **Airflow**, **FastAPI**, and **AWS-ready storage utilities**.

## Resume Version

**Built a scalable Retrieval-Augmented Generation (RAG) data pipeline using LangChain, ChromaDB/Pinecone-style vector indexing, Airflow, FastAPI, and AWS to automate distributed document ingestion, embedding generation, semantic search, and API-based retrieval.**

## Tech Stack

- **Python**: Core pipeline development
- **LangChain**: Document loading, chunking, and embedding workflow
- **ChromaDB**: Local vector database for semantic search
- **Airflow**: Scheduled ingestion and indexing workflow
- **FastAPI**: REST API for upload, ingestion, and search
- **AWS S3**: Cloud-ready document storage helper
- **Docker**: Containerized deployment

## Architecture

```text
Raw Documents/PDFs
       |
       v
Document Loader
       |
       v
Text Chunking with LangChain
       |
       v
Embedding Generation
       |
       v
ChromaDB Vector Index
       |
       v
FastAPI Search Endpoint
       |
       v
Semantic Search Results for RAG Applications
```

## Features

- Upload PDF, TXT, and Markdown files through API
- Load raw documents from local storage
- Split documents into overlapping chunks
- Generate embeddings using Hugging Face sentence transformers
- Persist vectors in ChromaDB
- Search documents using semantic similarity
- Schedule ingestion pipeline with Airflow
- AWS S3 helper for cloud document storage
- Docker-ready API deployment

## Project Structure

```text
rag-data-pipeline-system/
├── app/
│   ├── main.py              # FastAPI application
│   ├── ingest.py            # Document ingestion and vector indexing
│   ├── retriever.py         # Semantic search logic
│   ├── document_loader.py   # PDF/TXT/MD loader
│   ├── aws_utils.py         # AWS S3 helper
│   └── config.py            # Environment-based settings
├── airflow/
│   └── dags/
│       └── rag_ingestion_dag.py
├── data/
│   ├── raw/
│   └── processed/
├── scripts/
│   └── validate_documents.py
├── tests/
│   └── test_health.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rag-data-pipeline-system.git
cd rag-data-pipeline-system
```

### 2. Create virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
cp .env.example .env
```

### 5. Run FastAPI server

```bash
uvicorn app.main:app --reload
```

Open API docs:

```text
http://127.0.0.1:8000/docs
```

## API Usage

### Health Check

```bash
curl http://127.0.0.1:8000/
```

### Upload Document

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
  -F "file=@sample.pdf"
```

### Run Ingestion

```bash
curl -X POST "http://127.0.0.1:8000/ingest"
```

### Semantic Search

```bash
curl -X POST "http://127.0.0.1:8000/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"What is retrieval augmented generation?", "top_k":5}'
```

## Run with Docker

```bash
docker compose up --build
```

## Airflow DAG

The DAG `rag_document_ingestion_pipeline` runs two steps:

1. Validate raw documents
2. Ingest documents into ChromaDB

DAG file:

```text
airflow/dags/rag_ingestion_dag.py
```

## Future Improvements

- Add Pinecone support for managed vector search
- Add PostgreSQL metadata tracking
- Add distributed ingestion using AWS SQS or Kafka
- Add evaluation metrics for retrieval quality
- Add LLM answer generation endpoint
- Deploy FastAPI on AWS ECS or EC2
- Store document metadata and lineage for observability

## Resume Bullet Points

- Built an end-to-end RAG data pipeline using LangChain, ChromaDB, FastAPI, Airflow, and AWS-ready S3 utilities to automate document ingestion, embedding generation, and semantic retrieval.
- Designed scalable document processing workflow with chunking, vector indexing, and scheduled orchestration to support AI-powered question-answering applications.
- Developed REST APIs for document upload, ingestion triggering, and semantic search, enabling real-time retrieval over indexed enterprise documents.
- Containerized the pipeline with Docker and structured the project for cloud deployment on AWS infrastructure.

## LinkedIn/GitHub Description

A scalable Retrieval-Augmented Generation data pipeline built with LangChain, ChromaDB, Airflow, FastAPI, and AWS-ready storage utilities. The system ingests documents, generates embeddings, stores them in a vector database, and exposes semantic search APIs for AI-powered applications.
