import pytest

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_get_divisions(client):
    response = await client.get("/api/divisions")
    assert response.status_code == 200
    divisions = response.json()
    assert isinstance(divisions, list)
    # Check if seeded divisions are present
    division_names = [d["name"] for d in divisions]
    assert "Wind" in division_names
    assert "Solar" in division_names
    assert "Hydro" in division_names
