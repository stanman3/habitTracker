from fastapi import APIRouter, HTTPException, Depends
from schemas import UserCreate
from fastapi.security import OAuth2PasswordRequestForm
import models
from auth import get_current_active_user, db_dependency, authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from datetime import timedelta

router = APIRouter()

@router.get('/users/me/')
async def get_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

@router.post("/register/")
async def register(user: UserCreate, db: db_dependency):
    db_user = models.User(email = user.email, username = user.username, passwordHash = get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/token/")
async def login(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail='could not auth user')
    token = create_access_token({"sub": user.username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}