from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    username: str
    
class UserResponse(BaseModel):
    id: int
    username: str
    created_at: date
    
    class Config:
        from_attributes = True
        
class HabitCreate(BaseModel):
    name: str
    color: str
    
class HabitResponse(BaseModel):
    id: int
    user_id: int
    name: str
    color: str = "#42a5f5"
    created_at: date
    
    class Config: 
        from_attributes = True
        
class ActivityLogCreate(BaseModel):
    date: date
    count: int = 1
    
class ActivityLogResponse(BaseModel):
    id: int
    habit_id: int
    user_id: int
    date: date
    count: int
    
    class Config: 
        from_attributes = True
    