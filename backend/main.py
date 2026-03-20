from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.api import auth, trades, divisions
from src.db.database import engine, Base
from src.models.models import User, Division, Trade, TradeApproval # Ensure models are loaded
from sqlalchemy import text
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # For the MVP, we can initialize here if needed
    async with engine.begin() as conn:
        # 1. Create all tables defined in SQLAlchemy models
        await conn.run_sync(Base.metadata.create_all)
        
        # 2. Run custom SQL for Trade ID function (Postgres only)
        if engine.dialect.name == "postgresql":
            function_sql = """
            CREATE OR REPLACE FUNCTION generate_trade_id(div_id UUID)
            RETURNS TEXT AS $$
            DECLARE
                current_date_str TEXT;
                div_identifier INTEGER;
                next_sequence INTEGER;
                new_trade_id TEXT;
            BEGIN
                current_date_str := TO_CHAR(CURRENT_DATE, 'DD.MM.YYYY');
                SELECT identifier INTO div_identifier FROM divisions WHERE id = div_id;
                SELECT COUNT(*) + 1 INTO next_sequence FROM trades WHERE deal_date = CURRENT_DATE;
                new_trade_id := current_date_str || '-' || LPAD(next_sequence::TEXT, 6, '0') || '.' || div_identifier;
                RETURN new_trade_id;
            END;
            $$ LANGUAGE plpgsql;
            """
            await conn.execute(text(function_sql))
        
    # 3. Seed data using a session to handle dialect differences
    from src.db.database import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        # Check if divisions exist
        from sqlalchemy import select
        from src.models.models import Division, User
        
        div_result = await session.execute(select(Division).limit(1))
        if not div_result.scalar():
            session.add_all([
                Division(name='Wind', identifier=1),
                Division(name='Solar', identifier=2),
                Division(name='Hydro', identifier=3)
            ])
            await session.commit()

        # Ensure default users exist
        default_users = [
            User(
                username='mo_alhayek', 
                email='mo_alhayek@example.com', 
                password_hash='$2b$12$EixZaYVK1fsbw1ZfbX3OXePaGuNoG.U.E/k5U/5L/m2L6G.L.G.L.', 
                role='trader', 
                name='Mo Alhayek'
            ),
            User(
                username='mo_money', 
                email='momoney@example.com', 
                password_hash='$2b$12$EixZaYVK1fsbw1ZfbX3OXePaGuNoG.U.E/k5U/5L/m2L6G.L.G.L.', 
                role='trader', 
                name='Mo Money'
            ),
            User(
                username='sarah_manager', 
                email='sarah@example.com', 
                password_hash='$2b$12$EixZaYVK1fsbw1ZfbX3OXePaGuNoG.U.E/k5U/5L/m2L6G.L.G.L.', 
                role='manager', 
                name='Sarah Manager'
            )
        ]
        
        for u in default_users:
            user_result = await session.execute(select(User).where(User.username == u.username))
            if not user_result.scalar():
                session.add(u)
        await session.commit()
        
    yield

app = FastAPI(title="OTC Trade Flow API", lifespan=lifespan)

# Get allowed origins from environment variable, or use defaults for local development
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    if os.getenv("ENVIRONMENT") == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.include_router(auth.router)
app.include_router(trades.router)
app.include_router(divisions.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
