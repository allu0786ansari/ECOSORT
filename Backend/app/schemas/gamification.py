from pydantic import BaseModel
from typing import List

class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    score: int
    items_analyzed: int
    rank: int

    class Config:
        orm_mode = True

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]

class UserStats(BaseModel):
    user_id: int
    score: int
    items_analyzed: int
    rank: int
