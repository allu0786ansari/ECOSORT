from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def test_tts():
    return {"message": "TTS endpoint works"}
