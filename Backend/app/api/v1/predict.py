# app/api/v1/predict.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.config import get_settings

router = APIRouter()
settings = get_settings()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to classify an uploaded image/video using YOLO.
    TODO: connect with yolo_service.py for inference.
    """
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    return {
        "filename": filename,
        "label": "plastic",    # placeholder
        "confidence": 0.92,    # placeholder
        "instructions": "Dispose in the plastic recycling bin."
    }
