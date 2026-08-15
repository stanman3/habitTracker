from fastapi import APIRouter, HTTPException, Depends
from backend.auth import db_dependency, get_current_active_user
import models
from schemas import HabitCreate

router = APIRouter()


@router.get('/habits/')
async def get_habits(db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    result = db.query(models.Habit).filter(models.Habit.userId == current_user.id).all()
    return result

@router.get('/habits/{id}')
async def get_habit(id: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    result = db.query(models.Habit).filter(models.Habit.userId == current_user.id, models.Habit.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Habit not found")
    return result

@router.post('/habits/')
async def add_habit(habit: HabitCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    db_habit = models.Habit(title = habit.title, userId = current_user.id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.put('/habits/{id}')
async def update_habit(id: int, updated: HabitCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    habit = db.query(models.Habit).filter(models.Habit.id == id, models.Habit.userId == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    habit.title = updated.title # type: ignore
    db.commit()
    db.refresh(habit)
    return habit

@router.delete('/habits/{id}')
async def delete_habit(id: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    habit = db.query(models.Habit).filter(models.Habit.id == id, models.Habit.userId == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()
    return {"message": "Habit removed"}