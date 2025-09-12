from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from Backend.app.schemas.auth import UserCreate, UserResponse, UserLogin, Token, UserUpdate
from Backend.app.services.auth_service import UserService
from app.core.security import get_current_user
from typing import List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
user_service = UserService()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = await user_service.create_user(db, user)
        return new_user
    except ValueError as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during registration"
        )

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = await user_service.authenticate_user(db, user.username, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not authenticated_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    # Update last active timestamp
    authenticated_user.last_active = datetime.utcnow()
    db.commit()
    
    token = await user_service.create_access_token_for_user(authenticated_user)
    return token

@router.get("/users/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = await user_service.get_user_by_id(db, current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/users/me", response_model=UserResponse)
async def update_user_info(
    user_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = await user_service.update_user(db, current_user.id, user_data.dict(exclude_unset=True))
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return updated_user

@router.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = await user_service.delete_user(db, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return None

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = await user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real application, you might want to add pagination and filters
    users = db.query(User).filter(User.is_active == True).all()
    return [user_service._user_to_response(user) for user in users]