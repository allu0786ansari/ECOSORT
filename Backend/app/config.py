from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoSort AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    YOLO_MODEL_PATH: str = os.getenv("YOLO_MODEL_PATH", "./models/best.pt")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
