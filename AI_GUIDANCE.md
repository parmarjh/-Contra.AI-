# AI Guidance & Constraints

This document serves as the "System Prompt" for any AI agent working on the Contra.AI codebase.

## 1. Architectural Integrity
- **Separation of Concerns**: 
  - The `backend/` directory is the source of truth for all business logic and data persistence.
  - The `src/` (frontend) directory must remain a "dumb" client that focuses on presentation and state management.
  - Do not leak logic back into React components (e.g., no hardcoded response simulation in JSX).
- **Database Access**:
  - All database operations must go through `backend/models.py` and be accessed via `SessionLocal`.
  - Do not introduce raw SQL queries; use SQLAlchemy ORM.

## 2. Interface Safety
- **API Contracts**:
  - All new endpoints must accept and return JSON.
  - Input validation is mandatory. Check for missing keys and empty strings in `backend/app.py`.
  - Errors must be returned with appropriate HTTP status codes (4xx for client errors, 5xx for server errors) and a JSON body `{"error": "message"}`.
- **Type Safety**:
  - In Python, use type hints where complex logic exists.
  - In React, ensure Prop validation or TypeScript interfaces are respected (if migrated to TS).

## 3. Coding Standards
- **Simplicity > Cleverness**: Prefer readable, explicit code over "magic" one-liners.
- **Comments**: Explain *why* a complex decision was made, not just *what* the code does.
- **Testing**:
  - Any new backend feature must include a corresponding test in `backend/test_api.py`.
  - Run `pytest` to verify changes before committing.

## 4. AI Usage in Product
- **Determinism**: For the "Mock" or "Simulation" mode, ensure outputs are deterministic based on input keywords for easier testing.
- **Fallback**: The system must fail gracefully if the LLM service is unavailable (fallback to simulated logic).

## 5. Security
- **Secrets**: Never hardcode API keys. Use `os.environ` or `.env` files.
- **Injection**: Rely on ORM to prevent SQL injection. Sanitize user inputs before rendering in React (React does this by default, but be wary of `dangerouslySetInnerHTML`).

## 6. Change Management
- When modifying the `CULTURES` list, ensure both the Frontend (`CULTURES` object in JSX) and Backend (`SimulatedLLM` logic) are aligned, or better yet, move the `CULTURES` definition to a shared API endpoint `/api/config` to drive the frontend dynamically. (Future Extension)
