import openai
import os
from app.app.config import settings
import logging

logger = logging.getLogger(__name__)

class ChatbotService:
    def __init__(self):
        # Initialize OpenAI client if API key is available
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
        else:
            logger.warning("OpenAI API key not found. Using mock responses.")
    
    async def get_response(self, message: str) -> str:
        # If OpenAI is configured, use it
        if settings.OPENAI_API_KEY:
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are an expert waste management and recycling assistant. Provide helpful, accurate information about waste sorting, recycling, composting, and sustainability."},
                        {"role": "user", "content": message}
                    ],
                    max_tokens=150
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.error(f"OpenAI API error: {str(e)}")
                # Fall back to mock responses
        
        # Mock responses if OpenAI is not available
        mock_responses = [
            "Great question! Plastic bottles should be rinsed and placed in the recycling bin.",
            "That's a common waste sorting challenge. Food waste should generally be composted.",
            "Excellent eco-conscious thinking! Reducing single-use plastics is key to sustainability.",
            "I can definitely help with that. Glass is 100% recyclable and can be recycled endlessly.",
            "For proper e-waste disposal, look for certified electronics recycling facilities in your area."
        ]
        
        import random
        return random.choice(mock_responses)