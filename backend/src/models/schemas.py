from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from decimal import Decimal

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class LoginSimulated(BaseModel):
    username: str

class DivisionBase(BaseModel):
    name: str
    identifier: int

class Division(DivisionBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }

class TradeBase(BaseModel):
    seller: str
    buyer: str
    product: str
    division_id: UUID
    quantity: Decimal = Field(gt=0)
    delivery_date: date
    price: Decimal = Field(gt=0)
    currency: str = "EUR"

    @field_validator('delivery_date')
    @classmethod
    def delivery_date_must_be_future(cls, v):
        if v <= date.today():
            raise ValueError('delivery date must be in the future')
        return v

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: UUID
    trade_id: str
    deal_date: date
    total_price: Decimal
    status: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    
    # Optional nested data
    division: Optional[Division] = None

    model_config = {
        "from_attributes": True
    }

class TradeApprovalCreate(BaseModel):
    trade_id: UUID

class TradeApproval(BaseModel):
    id: UUID
    trade_id: UUID
    approved_by: UUID
    approved_at: datetime

    model_config = {
        "from_attributes": True
    }
