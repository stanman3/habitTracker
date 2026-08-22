import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

URL_DATABASE = os.getenv("DATABASE_URL", "postgresql://postgres:Rctvybun97.@localhost:5432/HabitTracker")

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()