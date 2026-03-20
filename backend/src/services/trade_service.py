from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from sqlalchemy.orm import selectinload
from src.models import models, schemas
from uuid import UUID

async def create_trade(db: AsyncSession, trade_in: schemas.TradeCreate, user_id: UUID):
    # Calculate total price
    total_price = trade_in.quantity * trade_in.price
    
    # Generate Trade ID using DB function (PostgreSQL)
    query = select(func.generate_trade_id(trade_in.division_id))
    result = await db.execute(query)
    trade_id_str = result.scalar()

    new_trade = models.Trade(
        **trade_in.dict(),
        trade_id=trade_id_str,
        total_price=total_price,
        created_by=user_id,
        status="pending"
    )
    
    db.add(new_trade)
    await db.commit()
    # Instead of just refreshing, we re-fetch with relationships to avoid MissingGreenlet error
    # when Pydantic tries to access the division relationship
    query = select(models.Trade).where(models.Trade.id == new_trade.id).options(selectinload(models.Trade.division))
    result = await db.execute(query)
    return result.scalar_one()

async def get_trades(db: AsyncSession, user: models.User, page: int = 1, size: int = 10):
    skip = (page - 1) * size
    
    # Base query for counting
    count_query = select(func.count()).select_from(models.Trade)
    
    # Base query for items
    query = select(models.Trade).options(selectinload(models.Trade.division))
    
    if user.role == "trader":
        count_query = count_query.where(models.Trade.created_by == user.id)
        query = query.where(models.Trade.created_by == user.id)
        
    query = query.order_by(models.Trade.created_at.desc()).offset(skip).limit(size)
    
    # Execute count
    count_result = await db.execute(count_query)
    total = count_result.scalar()
    
    # Execute fetch
    result = await db.execute(query)
    items = result.scalars().all()
    
    # Calculate total pages
    pages = (total + size - 1) // size if total > 0 else 1
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }

async def get_trade(db: AsyncSession, trade_id: UUID, user: models.User = None):
    query = select(models.Trade).options(selectinload(models.Trade.division)).where(models.Trade.id == trade_id)
    
    if user and user.role == "trader":
        query = query.where(models.Trade.created_by == user.id)
        
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def approve_trade(db: AsyncSession, trade_id: UUID, user_id: UUID):
    # Check if trade exists
    trade = await get_trade(db, trade_id)
    if not trade:
        return None
    
    # Check if already approved
    if trade.status == "approved":
        return trade
    
    # Update status
    trade.status = "approved"
    
    # Create approval record
    approval = models.TradeApproval(
        trade_id=trade_id,
        approved_by=user_id
    )
    db.add(approval)
    
    await db.commit()
    
    # Re-fetch to ensure all relationships are loaded for response
    query = select(models.Trade).where(models.Trade.id == trade.id).options(selectinload(models.Trade.division))
    result = await db.execute(query)
    return result.scalar_one()

async def get_divisions(db: AsyncSession):
    query = select(models.Division)
    result = await db.execute(query)
    return result.scalars().all()
