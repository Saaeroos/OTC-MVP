# OTC Trade Flow - Backend

This is the FastAPI backend for the OTC Trade Flow Application, providing core services for trade capture, automatic ID generation, and manager approval.

## Quick Start (Local Development)

### **Prerequisites**
- Python 3.11+
- PostgreSQL (or use Docker)

### **Setup**
1.  **Clone the repository**:
    ```bash
    git clone <repo_url>
    cd otc-flow/backend
    ```
2.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment Variables**:
    - Copy `.env.example` (if provided) or create `.env` from scratch:
    ```bash
    POSTGRES_USER=otc_user
    POSTGRES_PASSWORD=otc_pass
    POSTGRES_DB=otc_db
    DATABASE_URL=postgresql+asyncpg://otc_user:otc_pass@localhost:5432/otc_db
    SECRET_KEY=yoursupersecretkeyforjwt
    ```
5.  **Run the application**:
    ```bash
    uvicorn main:app --reload
    ```

## Running with Docker

1.  **Start the services**:
    ```bash
    docker-compose up -d
    ```
2.  **Access the API Documentation**:
    - Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
    - ReDoc UI: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Project Structure

- `main.py`: Entry point for the FastAPI application.
- `src/api/`: Contains the FastAPI routers for different resources (auth, trades, divisions).
- `src/services/`: Business logic layer (Trade creation, ID generation, Approval workflow).
- `src/models/`: Data definitions (SQLAlchemy models and Pydantic schemas).
- `src/db/`: Database configuration and initialization scripts (`init.sql`, `seed.sql`).

## Key Features

### **Simulated Authentication**
For testing purposes, the backend includes a simulated auth system:
- `GET /api/auth/simulated-users`: Lists available roles (Trader, Manager).
- `POST /api/auth/simulate-login`: Log in as a specific role for testing.

### **Automatic Trade ID Generation**
The `generate_trade_id` function in PostgreSQL automatically creates unique IDs in the format `dd.mm.yyyy-00000X.Y`.

### **Business Logic**
- Automatic calculation of `total_price` (Quantity × Price).
- Automatic `deal_date` (today) and `currency` (EUR) assignment.
- Role-based access control (Traders can create, Managers can approve).
