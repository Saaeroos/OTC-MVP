# OTC Trade Flow MVP

A full-stack application  to capture and manage  (OTC) energy trades across multiple divisions.

## Quick Start (Docker)

The easiest way to run the entire application (Frontend, Backend, and Database) is using Docker Compose.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### Instructions

1. Open your terminal and navigate to the project root directory.
2. Run the following command:
   ```bash
   docker compose up --build
   ```
3. Wait for the services to start. The initial setup will automatically create the database schema and seed it with test data (users and divisions).
4. Access the application:
   - **Frontend UI**: <http://localhost:3000>
   - **Backend API Docs (Swagger)**: <http://localhost:8000/docs>

***

## 💻 Manual Setup (Without Docker)

If you prefer to run the services locally without Docker, follow these steps.

### Prerequisites

- Python 3.10+
- Node.js 18+ & npm
- Docker Desktop (to run the isolated PostgreSQL instance)

### 1. Database Setup

Navigate to the `backend` directory and start the isolated PostgreSQL database using the provided docker-compose file:

```bash
cd backend
docker compose up -d db
```

*Note: We have a dedicated* *`docker-compose.yml`* *in the* *`backend`* *folder specifically to spin up just the database for local backend development, without needing to run the frontend in a container.*

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python3 main.py
   ```
   *The API will be available at* *<http://localhost:8000>*

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The UI will be available at* *<http://localhost:3000>*

***

## 🧪 Testing

The project includes  unit and end-to-end  testing.

### Frontend Tests

Navigate to the `frontend` directory:

- **Unit Tests**: `npm test`
- **Unit Test Coverage**: `npm run test:coverage`
- **E2E Tests (Playwright)**: `npm run test:e2e`
- **E2E Tests UI**: `npm run test:e2e:ui`

### Backend Tests

Navigate to the `backend` directory and ensure your virtual environment is active:

- **Run Tests**: `pytest`

***

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Query, Zustand, React Hook Form, Zod.
- **Backend**: FastAPI, Python 3.12, SQLAlchemy (Async), Pydantic.
- **Database**: PostgreSQL (with asyncpg).
- **Testing**: Vitest, React Testing Library, Playwright, Pytest.

