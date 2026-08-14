from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

URL_DATABASE = 'postgresql://postgres:Rctvybun97.@localhost:5432/HabitTracker'

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()