from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate, UserResponse, Token
from datetime import datetime, timedelta
from app.app.config import settings

class UserService:
    def __init__(self):
        pass

    async def create_user(self, db: Session, user: UserCreate) -> UserResponse:
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.username == user.username) | (User.email == user.email)
        ).first()
        
        if existing_user:
            if existing_user.username == user.username:
                raise ValueError("Username already exists")
            if existing_user.email == user.email:
                raise ValueError("Email already exists")
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            hashed_password=hashed_password,
            created_at=datetime.utcnow(),
            last_active=datetime.utcnow()
        )
        
        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return self._user_to_response(db_user)
        except IntegrityError:
            db.rollback()
            raise ValueError("User creation failed due to database error")

    async def authenticate_user(self, db: Session, username: str, password: str) -> User:
        user = db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    async def get_user_by_id(self, db: Session, user_id: int) -> UserResponse:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        return self._user_to_response(user)

    async def get_user_by_username(self, db: Session, username: str) -> UserResponse:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        return self._user_to_response(user)

    async def update_user(self, db: Session, user_id: int, user_data: dict) -> UserResponse:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        for key, value in user_data.items():
            if value is not None:
                setattr(user, key, value)
        
        user.last_active = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return self._user_to_response(user)

    async def delete_user(self, db: Session, user_id: int) -> bool:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        db.delete(user)
        db.commit()
        return True

    async def create_access_token_for_user(self, user: User) -> Token:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")

    def _user_to_response(self, user: User) -> UserResponse:
        return UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            points=user.points,
            level=user.level,
            streak=user.streak,
            items_analyzed=user.items_analyzed,
            created_at=user.created_at,
            last_active=user.last_active,
            is_active=user.is_active
        )