from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import date

from app.database import get_db
from app.models import Users
from app.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    
    existing = db.query(Users).filter(Users.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = Users(
        username = user.username, 
        created_at = date.today()
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Habit already exists")

@router.get("/{username}", response_model=UserResponse)
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user