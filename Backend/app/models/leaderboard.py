from sqlalchemy import Column, Integer, String
from app.database.session import Base  # Base from session.py

class Leaderboard(Base):
    __tablename__ = 'leaderboards'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    score = Column(Integer, default=0)
