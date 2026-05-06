from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from database import get_db
from models import Users
from schemas import UserCreate, UserResponse

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
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

    