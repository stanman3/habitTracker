from __future__ import annotations
from pydantic import BaseModel
from typing import Optional
from datetime import date

class TokenData(BaseModel):
    username: str | None = None

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True

class HabitCreate(BaseModel):
    title: str

class HabitResponse(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True

class HabitLogCreate(BaseModel):
    habitId: int
    date: Optional[date] = None
    completed: bool | None = False

class HabitLogResponse(BaseModel):
    habitId: int
    date: date

    class Config:
        from_attributes = True