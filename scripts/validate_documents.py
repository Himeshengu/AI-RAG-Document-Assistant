from pathlib import Path
from app.config import settings

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md"}


def main() -> None:
    raw_dir = Path(settings.raw_data_dir)
    raw_dir.mkdir(parents=True, exist_ok=True)
    files = [p for p in raw_dir.glob("**/*") if p.is_file()]
    unsupported = [str(p) for p in files if p.suffix.lower() not in SUPPORTED_EXTENSIONS]

    if unsupported:
        raise ValueError(f"Unsupported files found: {unsupported}")

    print(f"Validation complete. Supported files found: {len(files)}")


if __name__ == "__main__":
    main()
