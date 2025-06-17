# backend/tests/conftest.py
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.main import app # Your FastAPI app
from backend.api.deps import get_db # The dependency we want to override
from backend.tests.database_test import TestingSessionLocal, init_db, drop_db

@pytest.fixture(scope="session", autouse=True)
def initialize_test_db():
    init_db() # Create tables once per session
    yield
    drop_db() # Drop tables once per session

@pytest.fixture(scope="function") # function scope for db session to ensure isolation between tests
def db() -> Generator[Session, None, None]:
    connection = TestingSessionLocal.engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback() # Rollback changes after each test
    connection.close()


@pytest.fixture(scope="function")
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db
        finally:
            # db session managed by the db fixture
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    del app.dependency_overrides[get_db] # Clean up override

@pytest.fixture(scope="function")
def test_user_id() -> str:
    # In a real app, you'd create a user and return its ID.
    # For now, returning a fixed, valid UUID string.
    # This user doesn't actually exist in the test DB unless created by a test.
    # For Project creation, the owner_id needs to be valid if there's a FK constraint
    # checked by the DB, but SQLAlchemy/FastAPI might not check existence by default
    # unless explicitly coded. For these tests, we assume owner_id is just a UUID.
    import uuid
    return str(uuid.uuid4())
