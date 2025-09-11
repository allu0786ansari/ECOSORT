from app.schemas.gamification import LeaderboardResponse, UserStats, LeaderboardEntry
import random
from typing import List

class GamificationService:
    def __init__(self):
        # In a real implementation, this would connect to a database
        pass
    
    async def get_leaderboard(self) -> LeaderboardResponse:
        # Mock leaderboard data
        entries = [
            LeaderboardEntry(
                userId="user1",
                username="EcoWarrior42",
                points=2450,
                rank=1,
                itemsAnalyzed=187
            ),
            LeaderboardEntry(
                userId="user2",
                username="GreenThumb",
                points=2100,
                rank=2,
                itemsAnalyzed=162
            ),
            LeaderboardEntry(
                userId="user3",
                username="RecycleMaster",
                points=1950,
                rank=3,
                itemsAnalyzed=150
            ),
            LeaderboardEntry(
                userId="user4",
                username="PlanetSaver",
                points=1800,
                rank=4,
                itemsAnalyzed=138
            ),
            LeaderboardEntry(
                userId="user5",
                username="EcoChampion",
                points=1650,
                rank=5,
                itemsAnalyzed=125
            ),
        ]
        
        return LeaderboardResponse(entries=entries)
    
    async def get_user_stats(self, user_id: str) -> UserStats:
        # Mock user stats
        return UserStats(
            userId=user_id,
            points=1250,
            level="Eco Warrior",
            streak=15,
            itemsAnalyzed=87,
            rank=6
        )