# backend/tests/database_test.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base # Import your Base from models.py

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:" # In-memory SQLite for tests

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # check_same_thread for SQLite
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Create all tables in the in-memory database
    Base.metadata.create_all(bind=engine)

def drop_db():
    Base.metadata.drop_all(bind=engine)
