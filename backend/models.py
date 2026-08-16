from database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    username = Column(String, index=True)
    passwordHash = Column(String)

class Habit(Base):
    __tablename__ = 'habits'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    userId = Column(Integer, ForeignKey('users.id'), index=True)

class HabitLog(Base):
    __tablename__ = 'habitlogs'

    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    habitId = Column(Integer, ForeignKey('habits.id'), primary_key=True)
    date = Column(Date, primary_key=True)
    completed = Column(Boolean)