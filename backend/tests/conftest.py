import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from src.db.database import get_db, Base, engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool
import asyncio

# Use a separate test database or an in-memory one if possible
# For this MVP, we'll use the main one but clean up (not ideal for production)
TEST_DATABASE_URL = "postgresql+asyncpg://otc_user:otc_pass@localhost:5432/otc_db"

@pytest.fixture(scope="session")
def test_engine():
    return create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)

@pytest.fixture(scope="session")
def TestSessionLocal(test_engine):
    return async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture
async def db_session(test_engine, TestSessionLocal):
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()
        await session.close()

@pytest.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
