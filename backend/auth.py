from typing import Annotated
import models
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import timedelta, timezone, datetime
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import SessionLocal
import schemas


SECRET_KEY = "0bd3bda48ceb1e13dade82813a9ce5b9e2c25c75bc6c6efc4d7cf6969bc5a675"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl='token')

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_password_hash(password: str):
    result = pwd_context.hash(password)
    return result

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def authenticate_user(username: str, password: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail='User does not exist')
    valid = verify_password(password, user.passwordHash)# type: ignore
    if not valid:
        raise HTTPException(status_code=422, detail='Password not valid')
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth_2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not authorize user', headers={"WWW-Authenticate": "Bearer"})

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = schemas.TokenData(username = username)
    except JWTError:
        raise credential_exception

    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credential_exception
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    return current_user