# EduVerse

An interactive educational platform for learning Programming, Mathematics, and Physics. Built with React + FastAPI + Supabase + Claude AI.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (optional, for PostgreSQL)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your Supabase & Anthropic credentials
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker (alternative)
```bash
docker compose up
```

## Tech Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Supabase, Claude API
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (JWT)

## License
MIT
