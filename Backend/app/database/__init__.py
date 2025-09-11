from app.database.session import engine, Base
from app.models.user import User
from Backend.app.models.feedback_m import Feedback
from app.models.leaderboard import Leaderboard

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()