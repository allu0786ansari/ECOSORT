from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.leaderboard import Leaderboard
from app.models.user import User  # assuming you have this

class GamificationService:
    async def get_leaderboard(self):
        db: Session = SessionLocal()
        try:
            results = (
                db.query(Leaderboard, User.username)
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
        finally:
            db.close()

    async def update_leaderboard(self, user_id: int, score: int, items_analyzed: int):
        db: Session = SessionLocal()
        try:
            entry = db.query(Leaderboard).filter_by(user_id=user_id).first()
            if entry:
                entry.score = score
                entry.items_analyzed = items_analyzed
            else:
                entry = Leaderboard(
                    user_id=user_id,
                    score=score,
                    items_analyzed=items_analyzed,
                )
                db.add(entry)

            db.commit()
            db.refresh(entry)
            return {
                "user_id": entry.user_id,
                "username": entry.user.username if entry.user else f"User{entry.user_id}",
                "score": entry.score,
                "items_analyzed": entry.items_analyzed,
                "rank": None,  # rank comes from get_leaderboard
            }
        finally:
            db.close()

    async def get_user_stats(self, user_id: int):
        db: Session = SessionLocal()
        try:
            results = (
                db.query(Leaderboard, User.username)
                .join(User, Leaderboard.user_id == User.id)
                .order_by(Leaderboard.score.desc())
                .all()
            )

            rank = 0
            for idx, (row, username) in enumerate(results, start=1):
                if row.user_id == user_id:
                    rank = idx
                    return {
                        "user_id": row.user_id,
                        "score": row.score,
                        "items_analyzed": row.items_analyzed,
                        "rank": rank,
                    }

            # Default if not found
            return {"user_id": user_id, "score": 0, "items_analyzed": 0, "rank": len(results) + 1}
        finally:
            db.close()
