from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import date

from app.database import get_db
from app.models import Habits, Users, ActivityLogs
from app.schemas import HabitCreate, HabitResponse

router = APIRouter(prefix="/habits", tags=["Habits"])

@router.post("/{user_id}", response_model=HabitResponse)
def create_habit(user_id: int, habit: HabitCreate, db: Session = Depends(get_db)):
    existing = db.query(Users).filter(Users.id == user_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_habit = Habits(
        user_id=user_id,
        name=habit.name,
        color=habit.color,
        created_at=date.today()
    )
    
    try:
        db.add(new_habit)
        db.commit()
        db.refresh(new_habit)
        return new_habit
    except IntegrityError:
        db.rollback()  
        raise HTTPException(status_code=400, detail="Habit already exists")

@router.get("/{user_id}", response_model=list[HabitResponse])
def get_habits(user_id: int, db: Session = Depends(get_db)):
    existing_user = db.query(Users).filter(Users.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    habits = db.query(Habits).filter(Habits.user_id == user_id).all()
    return habits

@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habits).filter(Habits.id == habit_id).first()
    if not habit: 
        raise HTTPException(status_code=404, detail="Habit not found")
    
    db.query(ActivityLogs).filter(ActivityLogs.habit_id == habit_id).delete()
    
    db.delete(habit)
    db.commit()
    return {"message": "Habit deleted successfully"}
    