# backend/schemas/project_schemas.py
import uuid
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = 'planning'
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    currency: Optional[str] = Field('USD', max_length=3)

class ProjectCreate(ProjectBase):
    owner_id: uuid.UUID

class ProjectUpdate(ProjectBase):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    owner_id: Optional[uuid.UUID] = None


class ProjectInDBBase(ProjectBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ProjectSchema(ProjectInDBBase):
    pass

class ProjectSimple(BaseModel):
    id: uuid.UUID
    name: str
    owner_id: uuid.UUID
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    class Config:
        orm_mode = True
