from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.models import models
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "yoursupersecretkeyforjwt")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_username(db: AsyncSession, username: str):
    query = select(models.User).where(models.User.username == username)
    result = await db.execute(query)
    return result.scalar_one_or_none()
