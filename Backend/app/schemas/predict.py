from pydantic import BaseModel, Field
from typing import Optional

class PredictionResponse(BaseModel):
    item: str = Field(..., description="Identified waste item")
    category: str = Field(..., description="Waste category")
    confidence: int = Field(..., description="Confidence percentage", ge=0, le=100)
    instructions: str = Field(..., description="Disposal instructions")
    facts: str = Field(..., description="Interesting facts about the item")
    ecoTip: str = Field(..., description="Eco-friendly tip")
    color: str = Field(..., description="Color coding for UI")