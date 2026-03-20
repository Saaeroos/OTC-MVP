# OTC Trade Flow - Frontend

This is the React frontend for the OTC (Over-The-Counter) Trade Flow Application. It provides a user interface for traders to capture trades and for managers to review and approve them.

## Tech Stack
- **React 18** (with Vite)
- **TypeScript** for static typing
- **Tailwind CSS** for styling (with `clsx` and `tailwind-merge`)
- **TanStack React Query** for server state management
- **Zustand** for global client state management
- **React Hook Form & Zod** for form validation
- **Playwright** for E2E testing

## Quick Start (Local Development)

### **Prerequisites**
- Node.js 18+
- npm or pnpm

### **Setup**
1. **Navigate to the frontend directory**:
   ```bash
   cd otc-flow/frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run preview` - Previews the production build locally.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run format` - Formats code using Prettier.
- `npm run test` - Runs unit tests using Vitest.
- `npm run test:e2e` - Runs end-to-end tests using Playwright.
- `npm run test:e2e:ui` - Opens the Playwright UI mode for interactive E2E testing.

## Project Structure

```text
src/
├── api/          # Axios client setup and API service wrappers
├── components/   # UI components following Atomic Design (atoms, molecules, organisms, layout)
├── forms/        # Zod validation schemas
├── hooks/        # Custom React hooks (e.g., React Query hooks)
├── pages/        # Route-level page components
├── stores/       # Zustand global state stores
└── utils/        # Utility functions (e.g., Tailwind class merging)
```

## Features

- **Role-Based Views**: UI adapts based on whether the logged-in user is a `trader` or a `manager`.
- **Trade Capture Form**: Robust form with real-time validation and automatic whitespace sanitization.
- **Data Table**: Paginated list of trades fetched from the backend.
- **Accessibility**: Keyboard navigable interfaces, focus trapping in modals, and semantic HTML.
