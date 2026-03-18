from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from src.db.database import get_db
from src.services import trade_service
from src.models import schemas, models
from .auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/api/trades", tags=["trades"])

@router.post("", response_model=schemas.Trade)
async def create_trade(
    trade: schemas.TradeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "trader":
        raise HTTPException(status_code=403, detail="Only traders can create trades")
    return await trade_service.create_trade(db, trade, current_user.id)

@router.get("", response_model=List[schemas.Trade])
async def read_trades(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return await trade_service.get_trades(db, skip=skip, limit=limit)

@router.get("/{trade_id}", response_model=schemas.Trade)
async def read_trade(
    trade_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_trade = await trade_service.get_trade(db, trade_id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@router.put("/{trade_id}/approve", response_model=schemas.Trade)
async def approve_trade(
    trade_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can approve trades")
    
    db_trade = await trade_service.approve_trade(db, trade_id, current_user.id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade
