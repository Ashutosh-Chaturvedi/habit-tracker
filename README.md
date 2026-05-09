# 🟦 Habit Tracker

A full-stack habit tracking app with a GitHub-style calendar heatmap. Track your daily habits, visualize your consistency over time, and monitor your current streak.

![Habit Tracker](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- Create users and habits with custom colors
- Log daily activity with a single click
- Calendar heatmap visualization (monthly view)
- Color intensity based on activity count
- Current streak tracking
- Total activity count per habit

---

## 🗂️ Project Structure

```
habit-tracker/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── database.py       # SQLAlchemy engine and session
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── routers/
│   │       ├── users.py      # User routes
│   │       ├── habits.py     # Habit routes
│   │       └── logs.py       # Activity log routes
│   ├── alembic/              # Database migrations
│   ├── alembic.ini
│   └── requirements.txt
│
└── frontend/                 # React frontend
    ├── src/
    │   ├── api/
    │   │   └── index.js      # Axios API calls
    │   ├── components/
    │   │   └── HeatmapCalendar.jsx
    │   ├── pages/
    │   │   └── Home.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Deployment | Render |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

---

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
source .venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create a .env file
echo DATABASE_URL=postgresql://postgres:password@localhost:5432/habits_db > .env

# Run migrations
alembic upgrade head

# Start the server
cd app
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

API docs available at `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/` | Create a new user |
| POST | `/habits/{user_id}` | Create a habit for a user |
| GET | `/habits/{user_id}` | Get all habits for a user |
| POST | `/logs/{user_id}/{habit_id}` | Log activity for a habit |
| GET | `/logs/{habit_id}/heatmap` | Get heatmap data for a habit |

---

## 🗄️ Database Schema

```
users
├── id (PK)
├── username (unique)
└── created_at

habits
├── id (PK)
├── user_id (FK → users)
├── name
├── color
└── created_at

activity_logs
├── id (PK)
├── habit_id (FK → habits)
├── user_id (FK → users)
├── date
├── count
└── UNIQUE(habit_id, user_id, date)
```

---

## 🌐 Deployment

This project is deployed on [Render](https://render.com):

- **Frontend:** [habit-tracker-frontend-fina.onrender.com](https://habit-tracker-frontend-fina.onrender.com)
- **Backend:** [habit-tracker-b7iv.onrender.com](https://habit-tracker-b7iv.onrender.com)
- **Database:** Render PostgreSQL

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

---

## 📸 How to Use

1. Enter a username and click **Create User** — note your user ID
2. Enter a habit name, pick a color, and click **Create Habit**
3. Click **Load Habits** to see your habits
4. Click on any habit to expand the heatmap
5. Click **Log Today** to mark today as complete
6. Watch your streak grow! 🔥

---

## 🔜 Planned Features (Phase 5)

- [ ] Log activity for past dates
- [ ] Delete habits
- [ ] Year selector on heatmap
- [ ] User authentication
- [ ] Navbar and improved UI
- [ ] Mobile responsive design

---

## 📄 License

MIT License — feel free to use and modify.
