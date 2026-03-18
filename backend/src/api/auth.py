from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.db.database import get_db
from src.services import auth_service
from src.models import schemas, models
from jose import jwt
from src.services.auth_service import SECRET_KEY, ALGORITHM
from typing import List

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await auth_service.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@router.get("/simulated-users", response_model=List[schemas.User])
async def get_simulated_users(db: AsyncSession = Depends(get_db)):
    query = select(models.User)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Standard OAuth2 login for Swagger UI compatibility (password check bypassed for simulated login)
    user = await auth_service.get_user_by_username(db, username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/simulate-login", response_model=schemas.Token)
async def simulate_login(login: schemas.LoginSimulated, db: AsyncSession = Depends(get_db)):
    # Simpler login for the frontend dropdown
    user = await auth_service.get_user_by_username(db, username=login.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    access_token = auth_service.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": user}
