from sqlalchemy import Column, String, Integer, Float, Date, DateTime, ForeignKey, CheckConstraint, Numeric, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from src.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("NOW()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("NOW()"), onupdate=text("NOW()"))

    trades = relationship("Trade", back_populates="creator", foreign_keys="Trade.created_by")
    approvals = relationship("TradeApproval", back_populates="approver")

class Division(Base):
    __tablename__ = "divisions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(20), unique=True, nullable=False)
    identifier = Column(Integer, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("NOW()"))

    trades = relationship("Trade", back_populates="division")

class Trade(Base):
    __tablename__ = "trades"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trade_id = Column(String(50), unique=True, nullable=False)
    deal_date = Column(Date, nullable=False, server_default=text("CURRENT_DATE"))
    seller = Column(String(255), nullable=False)
    buyer = Column(String(255), nullable=False)
    product = Column(String(255), nullable=False)
    division_id = Column(UUID(as_uuid=True), ForeignKey("divisions.id"), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    delivery_date = Column(Date, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), server_default=text("'EUR'"))
    status = Column(String(20), server_default=text("'pending'"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("NOW()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("NOW()"), onupdate=text("NOW()"))

    division = relationship("Division", back_populates="trades")
    creator = relationship("User", back_populates="trades", foreign_keys=[created_by])
    approval = relationship("TradeApproval", back_populates="trade", uselist=False)

    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
        CheckConstraint('price > 0', name='check_price_positive'),
        CheckConstraint("status IN ('pending', 'approved')", name='check_status_valid'),
    )

class TradeApproval(Base):
    __tablename__ = "trade_approvals"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trade_id = Column(UUID(as_uuid=True), ForeignKey("trades.id"), unique=True, nullable=False)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    approved_at = Column(DateTime(timezone=True), server_default=text("NOW()"))

    trade = relationship("Trade", back_populates="approval")
    approver = relationship("User", back_populates="approvals")
