from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from src.db.database import get_db
from src.services import trade_service
from src.models import schemas

router = APIRouter(prefix="/api/divisions", tags=["divisions"])

@router.get("", response_model=List[schemas.Division])
async def read_divisions(db: AsyncSession = Depends(get_db)):
    return await trade_service.get_divisions(db)
