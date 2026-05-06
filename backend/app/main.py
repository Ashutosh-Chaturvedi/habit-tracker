from fastapi import FastAPI
from routers import users, habits, logs

app = FastAPI(title="Habit Tracker")

app.include_router(users.router)
app.include_router(habits.router)
app.include_router(logs.router)