from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, habits, logs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",                          # local development
        "https://habit-tracker-frontend-fina.onrender.com"  # production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(habits.router)
app.include_router(logs.router)