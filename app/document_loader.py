from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_core.documents import Document


def load_documents(raw_dir: str) -> list[Document]:
    """Load PDF and text documents from a local folder."""
    docs: list[Document] = []
    for file_path in Path(raw_dir).glob("**/*"):
        if file_path.is_dir():
            continue
        suffix = file_path.suffix.lower()
        if suffix == ".pdf":
            docs.extend(PyPDFLoader(str(file_path)).load())
        elif suffix in {".txt", ".md"}:
            docs.extend(TextLoader(str(file_path), encoding="utf-8").load())
    return docs
