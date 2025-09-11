from fastapi import APIRouter, HTTPException
from app.schemas.chatbot import ChatMessage, ChatResponse
from app.services.chatbot_service import ChatbotService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
chatbot_service = ChatbotService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(message: ChatMessage):
    try:
        response = await chatbot_service.get_response(message.message)
        return ChatResponse(message=response)
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")