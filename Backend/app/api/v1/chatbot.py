# app/api/v1/chatbot.py
from fastapi import APIRouter, Body
from app.config import get_settings

router = APIRouter()
settings = get_settings()

@router.post("/chat")
async def chat(message: str = Body(..., embed=True)):
    """
    Chatbot endpoint.
    TODO: connect with chatbot_service.py using Gemini API.
    """
    return {
        "user_message": message,
        "bot_reply": "This is a placeholder response from EcoSortAI chatbot."
    }
