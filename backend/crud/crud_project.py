# backend/crud/crud_project.py
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.models import Project
from backend.schemas.project_schemas import ProjectCreate, ProjectUpdate

def get_project(db: Session, project_id: uuid.UUID) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    return db.query(Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: ProjectCreate) -> Project:
    db_project = Project(
        name=project.name,
        description=project.description,
        status=project.status,
        start_date=project.start_date,
        end_date=project.end_date,
        budget=project.budget,
        currency=project.currency,
        owner_id=project.owner_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: uuid.UUID, project_data: ProjectUpdate) -> Optional[Project]:
    db_project = get_project(db, project_id)
    if not db_project:
        return None

    update_data = project_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: uuid.UUID) -> Optional[Project]:
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    db.delete(db_project)
    db.commit()
    return db_project
