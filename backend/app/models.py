from database import Base
from sqlalchemy import Integer, Column, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    created_at = Column(Date, nullable=False)
    
    habits = relationship("Habits", back_populates="owner", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLogs", back_populates="owner", cascade="all, delete-orphan")
    
class Habits(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False, unique=True)
    color = Column(String, nullable=False)
    created_at = Column(Date, nullable=False)
    
    owner = relationship("Users", back_populates="habits")
    logs = relationship("ActivityLogs", back_populates="habit", cascade="all, delete-orphan")
    
class ActivityLogs(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    count = Column(Integer, nullable=False)
    
    owner = relationship("Users", back_populates="activity_logs")
    habit = relationship("Habits", back_populates="logs")
    
    __table_args__ = (UniqueConstraint("habit_id", "user_id", "date"),)