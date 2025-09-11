# app/config.py
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
import os

class Settings(BaseSettings):
    # App & Project Config
    PROJECT_NAME: str = "EcoSort AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    YOLO_MODEL_PATH: str = os.getenv("YOLO_MODEL_PATH", "./app/Trained_model/best_model_waste_detection.pt")

    # The following fields are from your .env file
    APP_NAME: str
    APP_ENV: str
    APP_DEBUG: bool
    APP_HOST: str
    APP_PORT: int
    GEMINI_API_KEY: str
    GEMINI_MODEL: str
    YOLO_CONFIDENCE_THRESHOLD: float
    YOLO_IOU_THRESHOLD: float
    TTS_PROVIDER: str
    TTS_AUDIO_DIR: str
    UPLOAD_DIR: str
    ALLOWED_EXTENSIONS: str
    POINTS_PER_CORRECT: int
    BADGE_THRESHOLDS: str

    class Config:
        case_sensitive = True
        env_file = ".env"
        # The 'extra' setting is what caused your original error.
        # It is set to 'forbid' by default, which means it raises an error
        # if it finds fields in the .env file not in your model.
        # By defining all the fields above, we resolve the issue.

# This function is used to create a settings object that can be
# used as a FastAPI dependency.
def get_settings():
    return Settings()

settings = get_settings()