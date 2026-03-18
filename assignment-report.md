# OTC Trade Flow Application - Assignment Report

This report explains the methodology, prioritization, and technical decisions behind the OTC Trade Flow Application.

## 1. Task Derivation Methodology
To ensure a robust and complete MVP, I broke down the user stories into technical requirements across three layers: **Database**, **Backend**, and **Frontend**.

### **From US-1 (Trade ID Generation):**
- **Requirement**: Format `dd.mm.yyyy-00000X.Y` (Sequential X per day, Y=Division).
- **Task**: Implement a thread-safe PostgreSQL function to handle the sequential numbering. This avoids race conditions and ensures data integrity during high-concurrency trade capture.

### **From US-2 (Trade Capture):**
- **Requirement**: Fast, efficient entry with 10+ fields and automatic calculations.
- **Task**: Create a FastAPI service that automatically calculates `total_price` and uses Pydantic V2 for real-time validation (e.g., ensuring delivery dates are in the future).

### **From US-3 (Manager Approval):**
- **Requirement**: Role-based access where managers can approve trades.
- **Task**: Implement a dedicated approval endpoint and a many-to-one relationship between users and approvals to maintain a clear audit trail.

---

## 2. Task Prioritization
I followed a **"Data-First, Security-Early"** strategy:

1.  **Priority 1: Core Infrastructure**: Setting up the PostgreSQL schema and FastAPI boilerplate. Without a solid data model, the rest of the application is fragile.
2.  **Priority 2: Business Logic (US-1 & US-2)**: Implementing the trade ID generation and creation logic. These are the core value-drivers for the trader.
3.  **Priority 3: Simulated Auth**: Developing the role-switching mechanism. This was prioritized early to enable testing of the approval workflow.
4.  **Priority 4: Approval Workflow (US-3)**: Building the manager-specific logic.
5.  **Priority 5: Frontend Integration**: (Next Step) Building the React UI using React Query, Zustand, and React Hook Form.

---

## 3. Application Functions
The application provides the following core capabilities:

- **Automatic Trade ID Engine**: Generates unique, compliant IDs based on the trade's date and division.
- **Simulated Identity Management**: A dedicated "Simulated Login" system that allows users to toggle between **Trader** and **Manager** roles for easy testing.
- **Real-time Validation Engine**: Prevents mistakes (US-2) by enforcing strict data types and business rules (e.g., no past delivery dates).
- **Auto-Computation Service**: Automatically calculates total prices to reduce manual entry effort.
- **One-Click Approval Workflow**: Allows managers to finalize trades with a single action, automatically updating statuses and timestamps.

---

## 4. User Story Alignment

| User Story | Implementation Feature | Status |
| :--- | :--- | :--- |
| **US-1: Trade ID** | PostgreSQL function `generate_trade_id` with division identifiers. | ✅ Complete (Backend) |
| **US-2: Trade Capture** | FastAPI endpoint with Pydantic validation and auto-calculation. | ✅ Complete (Backend) |
| **US-3: Approval** | Role-based PUT endpoint with audit trail recording. | ✅ Complete (Backend) |

---

## 5. Technical Decisions & Trade-offs

### **Backend: FastAPI (Python)**
- **Decision**: Structured with a clear separation of Routers (API), Services (Business Logic), and Models (Data).
- **Reasoning**: This "Clean Architecture" approach ensures that business logic (like ID generation) is decoupled from the web framework, making it easier to test and maintain.

### **Frontend: React (Vite) + React Query + Zustand**
- **Decision**: Using React SPAs over Next.js for a more responsive, "app-like" feel in a data-entry intensive tool.
- **React Query**: Added to handle server-state management (caching, loading states, and automatic re-fetching).
- **Zustand**: Used for lightweight global state (e.g., current user role).

### **Database: PostgreSQL**
- **Decision**: Moving ID generation logic to the database layer via PL/pgSQL.
- **Reasoning**: This ensures that even if multiple backend instances are running, the serial numbering for Trade IDs remains perfectly sequential and unique.
