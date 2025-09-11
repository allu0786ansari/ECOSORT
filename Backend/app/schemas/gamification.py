from pydantic import BaseModel

class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    score: int

class LeaderboardResponse(BaseModel):
    entries: list[LeaderboardEntry]

class UserStats(BaseModel):
    user_id: int
    total_score: int
    rank: int
