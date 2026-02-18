# Contra.AI - Cultural Language Model Interface

Contra.AI is a concept application for a "Cultural Language Model" (CLM). Unlike traditional LLMs that strive for a single "neutral" voice, Contra explicitly adopts distinct cultural personas, reasoning frameworks, and communication styles.

## 🌟 Features

- **Cultural Context Engine**: Switch between 12+ distinct cultural agents (e.g., Japanese Keigo, Yoruba Elder, Gen Z, NYC Direct).
- **God Mode Aesthetic**: Premium, dark-themed UI with glassmorphism and neon accents.
- **Adaptive Responses**: Response patterns change based on cultural settings.
- **Interactive Demo**: Real-time chat interface.

## 🛠 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Custom Variables & Utilities)
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend
- **Framework**: Python + Flask
- **Database**: SQLite (SQLAlchemy ORM)
- **AI Service**: Simulated LLM (Ported Logic) / Extensible for OpenAI/Anthropic

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+

### Installation & Setup

#### 1. Backend Setup
The backend handles the chat logic, AI simulation, and database logging.

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```
The server will start on `http://localhost:5000`.

#### 2. Frontend Setup
The frontend communicates with the backend via a proxy.

```bash
# In the root directory (Contra/)
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧪 Verification & Testing

### Backend Tests
To verify the core logic and database integration, run the test suite:

```bash
cd backend
pytest test_api.py
```

### Manual Testing
1. Open the app in the browser.
2. Select **Japanese (Keigo)**.
3. Type: "This price is too high."
4. Expected Result: A polite, apologetic response ("We deeply apologize...").
5. Check `backend/contra.db` (using a SQLite viewer) to see the logged interaction.

## 📂 Project Structure

- `backend/`: Python Flask application.
  - `app.py`: API Routes.
  - `models.py`: Database schema.
  - `services.py`: AI Logic (Simulated).
- `src/`: React Frontend.
  - `components/CulturalDemo.jsx`: Main UI.
- `AI_GUIDANCE.md`: Instructions for AI agents working on this repo.
- `WALKTHROUGH.md`: Detailed architectural overview.
