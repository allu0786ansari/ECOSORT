import os
import shutil
from fastapi import UploadFile
from uuid import uuid4

async def save_upload_file(upload_file: UploadFile) -> str:
    upload_dir = "./uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid4().hex}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return file_path
