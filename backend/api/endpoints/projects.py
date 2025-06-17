# backend/api/endpoints/projects.py
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.schemas.project_schemas import ProjectSchema, ProjectCreate, ProjectUpdate, ProjectSimple
from backend.crud import crud_project
from backend.api import deps

router = APIRouter()

@router.post("/", response_model=ProjectSchema, status_code=status.HTTP_201_CREATED)
def create_new_project(
    project_in: ProjectCreate,
    db: Session = Depends(deps.get_db)
):
    return crud_project.create_project(db=db, project=project_in)

@router.get("/{project_id}", response_model=ProjectSchema)
def read_project_by_id(
    project_id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    db_project = crud_project.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return db_project

@router.get("/", response_model=List[ProjectSimple])
def read_all_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    projects = crud_project.get_projects(db, skip=skip, limit=limit)
    return projects

@router.put("/{project_id}", response_model=ProjectSchema)
def update_existing_project(
    project_id: uuid.UUID,
    project_in: ProjectUpdate,
    db: Session = Depends(deps.get_db)
):
    db_project = crud_project.update_project(db, project_id=project_id, project_data=project_in)
    if db_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return db_project

@router.delete("/{project_id}", response_model=ProjectSchema)
def delete_existing_project(
    project_id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    deleted_project = crud_project.delete_project(db, project_id=project_id)
    if deleted_project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return deleted_project
