# app/models/leaderboard.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class Leaderboard(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationship to user
    user = relationship("User", backref="leaderboard_entries")
