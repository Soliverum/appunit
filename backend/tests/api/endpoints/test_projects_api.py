# backend/tests/api/endpoints/test_projects_api.py
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.schemas.project_schemas import ProjectCreate, ProjectUpdate
# from backend.models import User # If you create a test user

# Basic test for creating a project
def test_create_project_success(client: TestClient, test_user_id: str):
    project_data = {
        "name": "Test Project Alpha",
        "description": "A test project description",
        "owner_id": test_user_id
    }
    response = client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == project_data["name"]
    assert data["description"] == project_data["description"]
    assert "id" in data
    assert data["owner_id"] == test_user_id

def test_create_project_missing_name(client: TestClient, test_user_id: str):
    project_data = {"description": "Missing name test", "owner_id": test_user_id}
    response = client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 422 # Unprocessable Entity for Pydantic validation error

# Test for reading projects
def test_read_projects_list(client: TestClient, db: Session, test_user_id: str):
    # Create a project first to ensure there's data
    project_data = {"name": "Project for List Test", "owner_id": test_user_id}
    client.post("/api/v1/projects/", json=project_data)

    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # This assertion might be flaky if other tests add projects.
    # For robust testing, ensure clean state or more specific filtering.
    # For now, we assume this test runs reasonably isolated or first for this check.
    assert data[0]["name"] == project_data["name"]

def test_read_single_project_success(client: TestClient, db: Session, test_user_id: str):
    project_create_data = {"name": "Project Read Test", "owner_id": test_user_id}
    create_response = client.post("/api/v1/projects/", json=project_create_data)
    project_id = create_response.json()["id"]

    response = client.get(f"/api/v1/projects/{project_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == project_create_data["name"]
    assert data["id"] == project_id

def test_read_single_project_not_found(client: TestClient):
    non_existent_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/projects/{non_existent_uuid}")
    assert response.status_code == 404

# Test for updating a project
def test_update_project_success(client: TestClient, db: Session, test_user_id: str):
    project_create_data = {"name": "Project Update Old Name", "owner_id": test_user_id}
    create_response = client.post("/api/v1/projects/", json=project_create_data)
    project_id = create_response.json()["id"]

    update_data = {"name": "Project Update New Name", "description": "Updated description"}
    response = client.put(f"/api/v1/projects/{project_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["description"] == update_data["description"]
    assert data["id"] == project_id

def test_update_project_not_found(client: TestClient):
    non_existent_uuid = str(uuid.uuid4())
    update_data = {"name": "Ghost Project"}
    response = client.put(f"/api/v1/projects/{non_existent_uuid}", json=update_data)
    assert response.status_code == 404

# Test for deleting a project
def test_delete_project_success(client: TestClient, db: Session, test_user_id: str):
    project_create_data = {"name": "Project To Be Deleted", "owner_id": test_user_id}
    create_response = client.post("/api/v1/projects/", json=project_create_data)
    project_id = create_response.json()["id"]

    response = client.delete(f"/api/v1/projects/{project_id}")
    assert response.status_code == 200 # Assuming API returns the deleted object
    data = response.json()
    assert data["id"] == project_id

    # Verify it's actually deleted
    get_response = client.get(f"/api/v1/projects/{project_id}")
    assert get_response.status_code == 404

def test_delete_project_not_found(client: TestClient):
    non_existent_uuid = str(uuid.uuid4())
    response = client.delete(f"/api/v1/projects/{non_existent_uuid}")
    assert response.status_code == 404
