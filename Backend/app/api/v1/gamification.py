from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.gamification import LeaderboardResponse, UserStats
from app.services.gamification_service import GamificationService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
gamification_service = GamificationService()

class LeaderboardUpdateRequest(BaseModel):
    user_id: int
    score: int
    items_analyzed: int

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard():
    try:
        return await gamification_service.get_leaderboard()
    except Exception as e:
        logger.error(f"Leaderboard error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch leaderboard")

@router.post("/leaderboard")
async def update_leaderboard(data: LeaderboardUpdateRequest):
    try:
        return await gamification_service.update_leaderboard(
            user_id=data.user_id,
            score=data.score,
            items_analyzed=data.items_analyzed,
        )
    except Exception as e:
        logger.error(f"Leaderboard update error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update leaderboard")

@router.get("/user/{user_id}/stats", response_model=UserStats)
async def get_user_stats(user_id: int):
    try:
        return await gamification_service.get_user_stats(user_id)
    except Exception as e:
        logger.error(f"User stats error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user stats")
