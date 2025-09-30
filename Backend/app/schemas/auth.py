# app/schemas/auth.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
from pydantic import BaseModel, EmailStr

# For signup
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# For login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# For returning user info with token
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    token: Optional[str] = None


# Optional: For password reset
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

class Config:
        orm_mode = True