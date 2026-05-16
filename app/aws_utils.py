from pathlib import Path
import boto3
from botocore.exceptions import ClientError

from app.config import settings


def upload_file_to_s3(local_path: str, s3_key: str | None = None) -> dict:
    """Upload a file to S3 for cloud-ready document storage."""
    path = Path(local_path)
    if not path.exists():
        return {"status": "error", "message": f"File not found: {local_path}"}

    key = s3_key or path.name
    s3 = boto3.client("s3", region_name=settings.aws_region)

    try:
        s3.upload_file(str(path), settings.s3_bucket_name, key)
        return {"status": "success", "bucket": settings.s3_bucket_name, "key": key}
    except ClientError as exc:
        return {"status": "error", "message": str(exc)}
