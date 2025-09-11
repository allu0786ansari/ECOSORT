# app/api/v1/tts.py
from fastapi import APIRouter, Body

router = APIRouter()

@router.post("/tts")
async def generate_tts(text: str = Body(..., embed=True)):
    """
    Generate speech (TTS) for given text.
    TODO: connect with tts_service.py.
    """
    return {
        "text": text,
        "audio_url": "/static/audio/example.mp3"  # placeholder
    }
