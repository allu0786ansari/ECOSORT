from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = settings.SECRET_KEY  # must be set in .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# -----------------------
# Password helpers
# -----------------------
def hash_password(password: str) -> str:
    """Hash a plain password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


# -----------------------
# Token helpers
# -----------------------
def create_access_token(
    data: dict,
    expires_delta: Optional[int] = None
) -> str:
    """
    Create JWT access token.
    :param data: dict payload
    :param expires_delta: expiration in seconds (default: 60 minutes)
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        seconds=expires_delta if expires_delta else ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify JWT token.
    Returns payload if valid, None if invalid/expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
