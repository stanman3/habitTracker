from fastapi import APIRouter, HTTPException, Depends
from schemas import HabitLogCreate
import models
from datetime import date
from auth import db_dependency, get_current_active_user

router = APIRouter()

@router.get('/habitlogs/')
async def get_habitlogs(date: date, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    result = db.query(models.HabitLog).filter(models.HabitLog.date == date, models.HabitLog.userId == current_user.id).all()
    if not result:
        raise HTTPException(status_code=404, detail="habitLog not found")
    return result

@router.post('/habitlogs/')
async def add_habitlog(habitlog: HabitLogCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    db_habitlog = models.HabitLog(habitId = habitlog.habitId, userId = current_user.id, date = date.today(), completed = habitlog.completed)
    db.add(db_habitlog)
    db.commit()
    db.refresh(db_habitlog)
    return db_habitlog

@router.put('/habitlogs/')
async def update_habitlog(updated: HabitLogCreate, date: date, habitId: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    habitlog = db.query(models.HabitLog).filter(models.HabitLog.date == date, models.HabitLog.userId == current_user.id, models.HabitLog.habitId == habitId).first()
    if not habitlog:
        raise HTTPException(status_code=404, detail="habitLog not found")
    habitlog.completed = updated.completed #type:ignore
    db.commit()
    db.refresh(habitlog)
    return habitlog