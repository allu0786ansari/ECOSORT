from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.schemas.predict import PredictionResponse
from app.services.yolo_service import YOLOService
from app.utils.file_utils import save_upload_file
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize YOLO service
yolo_service = YOLOService()

@router.post("/predict", response_model=PredictionResponse)
async def predict_waste(
    file: UploadFile = File(...)
):
    try:
        # Save uploaded file temporarily
        file_path = await save_upload_file(file)
        
        # Process image with YOLO
        result = await yolo_service.predict(file_path)
        
        # Clean up temporary file
        import os
        os.remove(file_path)
        
        return result
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")