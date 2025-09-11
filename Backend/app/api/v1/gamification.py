from fastapi import APIRouter, HTTPException
from app.schemas.gamification import LeaderboardResponse, UserStats
from app.services.gamification_service import GamificationService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
gamification_service = GamificationService()

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard():
    try:
        return await gamification_service.get_leaderboard()
    except Exception as e:
        logger.error(f"Leaderboard error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@router.get("/user/{user_id}/stats", response_model=UserStats)
async def get_user_stats(user_id: str):
    try:
        return await gamification_service.get_user_stats(user_id)
    except Exception as e:
        logger.error(f"User stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch user stats: {str(e)}")