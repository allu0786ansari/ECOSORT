from sqlalchemy.orm import Session, joinedload
from app.database.session import SessionLocal
from app.models.leaderboard import Leaderboard
from app.models.user import User

class GamificationService:
    def __init__(self):
        self.db: Session = SessionLocal()

    def __del__(self):
        self.db.close()

    async def get_leaderboard(self):
        results = (
            self.db.query(Leaderboard, User.username)
            .join(User, Leaderboard.user_id == User.id)
            .order_by(Leaderboard.score.desc())
            .all()
        )

        entries = []
        for idx, (row, username) in enumerate(results, start=1):
            entries.append({
                "user_id": row.user_id,
                "username": username,
                "score": row.score,
                "items_analyzed": row.items_analyzed,
                "rank": idx,
            })
        return {"entries": entries}

    async def update_leaderboard(self, user_id: int, score: int, items_analyzed: int):
        entry = (
            self.db.query(Leaderboard)
            .options(joinedload(Leaderboard.user))
            .filter_by(user_id=user_id)
            .first()
        )

        if entry:
            # ✅ increment instead of overwrite
            entry.score += score
            entry.items_analyzed += items_analyzed
        else:
            entry = Leaderboard(
                user_id=user_id,
                score=score,
                items_analyzed=items_analyzed,
            )
            self.db.add(entry)

        self.db.commit()
        self.db.refresh(entry)

        return {
            "user_id": entry.user_id,
            "username": entry.user.username if entry.user else f"User{entry.user_id}",
            "score": entry.score,
            "items_analyzed": entry.items_analyzed,
            "rank": None,  # rank is handled separately
        }

    async def get_user_stats(self, user_id: int):
        results = (
            self.db.query(Leaderboard, User.username)
            .join(User, Leaderboard.user_id == User.id)
            .order_by(Leaderboard.score.desc())
            .all()
        )

        for idx, (row, username) in enumerate(results, start=1):
            if row.user_id == user_id:
                return {
                    "user_id": row.user_id,
                    "score": row.score,
                    "items_analyzed": row.items_analyzed,
                    "rank": idx,
                }

        # Default if not found
        return {
            "user_id": user_id,
            "score": 0,
            "items_analyzed": 0,
            "rank": len(results) + 1,
        }
