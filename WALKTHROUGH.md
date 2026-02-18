# Walkthrough (10-15 min)

## 1. Structure
This project is a full-stack application split into two primary components:
- **Backend (API)**: Python + Flask + SQLite (in `backend/`).
  - `app.py`: Entry point and route definitions. Simple and readable.
  - `models.py`: Database schema (SQLAlchemy). Handles persistence.
  - `services.py`: Business logic and AI integration. Contains the "SimulatedLLM" to mimic AI behavior locally without API keys.
  - `test_api.py`: Verification suite.
- **Frontend (Client)**: React (Vite) (in `src/`).
  - `CulturalDemo.jsx`: The main UI component.
  - Communicates with the backend via `/api/chat`.
  - Styling with vanilla CSS and Lucide icons.

The separation ensures that frontend logic remains purely presentational, while the backend handles the "intelligence" and state.

## 2. AI Usage
- **Development**:
  - AI was used to generate the boilerplate Flask code, SQL models, and frontend refactoring.
  - AI was used to port the complex JavaScript cultural logic into a Python service (`SimulatedLLM`), ensuring fidelity to the original design while moving logic server-side.
- **Product**:
  - The application simulates a "Cultural Language Model" using keyword heuristics.
  - It is designed to be easily upgraded to use real LLMs (OpenAI, Anthropic) by swapping the `SimulatedLLM` class for a `RealLLM` implementation in `services.py`.

## 3. Risks & Mitigations
- **Network Latency**: Moving logic from client to server introduces latency.
  - *Mitigation*: The frontend shows a loading animation (`isTyping`) during the fetch.
- **Data Integrity**: SQLite is file-based and not suitable for high concurrency.
  - *Mitigation*: For production, switch the SQLAlchemy connection string to PostgreSQL. The ORM validates schema integrity.
- **Prompt Injection**: If connected to a real LLM, users might try to jailbreak the persona.
  - *Mitigation*: System prompts in `services.py` should be carefully engineered and tested (e.g., "You are a helpful assistant" instructions).

## 4. Extension Approach
- **Dynamic Configuration**: Currently, the list of cultures is duplicated in Frontend and Backend logic.
  - *Next Step*: Create a `/api/config` endpoint that returns the available cultures and their metadata. The frontend should fetch this list on load, making the system configuration-driven.
- **User Accounts**: Add a `User` model to `models.py` and link `ChatLog` to users.
- **Real AI**: Implement `OpenAILLM` class in `services.py` that inherits from `LLMInterface`. Use `.env` for keys.

## 5. Verification
- Run `pytest backend/test_api.py` to verify backend correctness.
- The tests cover valid inputs, empty inputs, specific cultural logic, and database persistence.
