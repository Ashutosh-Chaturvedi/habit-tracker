from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import date

from database import get_db
from models import Habits, Users, ActivityLogs
from schemas import ActivityLogCreate, ActivityLogResponse

router = APIRouter(prefix="/logs", tags=["ActivityLogs"])

@router.post("/{user_id}/{habit_id}", response_model=ActivityLogResponse)
def create_log(user_id: int, habit_id: int, log: ActivityLogCreate, db: Session = Depends(get_db)):
    
    existing_user = db.query(Users).filter(Users.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_habit = db.query(Habits).filter(Habits.id==habit_id).first()
    if not existing_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    existing_log = db.query(ActivityLogs).filter(
        ActivityLogs.habit_id == habit_id,
        ActivityLogs.user_id == user_id,
        ActivityLogs.date == log.date
    ).first()
    if existing_log:
        existing_log.count += log.count     # type: ignore
        db.commit()
        db.refresh(existing_log)
        return existing_log
    
    new_log = ActivityLogs(
        habit_id=habit_id,
        user_id=user_id,
        date=log.date,
        count=log.count
    )
    
    try:
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Habit already exists")


@router.get("/{habit_id}/heatmap")
def get_heatmap(habit_id: int, db: Session = Depends(get_db), year: int = Query(default=date.today().year)):
    existing_habit = db.query(Habits).filter(Habits.id == habit_id).first()
    if not existing_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    
    logs = db.query(ActivityLogs).filter(
        ActivityLogs.habit_id == habit_id,
        ActivityLogs.date >= start_date,
        ActivityLogs.date <= end_date
    ).all()
    
    return [{"date": str(log.date), "count": log.count} for log in logs]