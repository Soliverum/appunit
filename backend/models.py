import uuid
from sqlalchemy import Column, Integer, String, Text, Boolean, Date, DateTime, Numeric, ForeignKey, func
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import UUID as SQLAlchemyUUID

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default='user') # e.g., 'admin', 'project_manager', 'user'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    projects = relationship("Project", back_populates="owner")
    tasks_assigned = relationship("Task", back_populates="assignee")

class Project(Base):
    __tablename__ = "projects"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    status = Column(String, default='planning') # e.g., 'planning', 'in_progress', 'completed', 'on_hold'
    start_date = Column(Date)
    end_date = Column(Date)
    budget = Column(Numeric(15, 2)) # Precision 15, 2 decimal places
    currency = Column(String(3), default='USD') # ISO 4217 currency code
    owner_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="projects")
    apus = relationship("APU", back_populates="project")
    budgets = relationship("Budget", back_populates="project")
    tasks = relationship("Task", back_populates="project")

class Resource(Base):
    __tablename__ = "resources"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    type = Column(String, nullable=False) # e.g., 'labor', 'material', 'equipment', 'subcontract'
    unit = Column(String, nullable=False) # e.g., 'hour', 'sqm', 'piece', 'day'
    unit_cost = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default='USD')
    supplier = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    apu_items = relationship("APUItem", back_populates="resource")

class APU(Base): # Analisis de Precios Unitarios
    __tablename__ = "apus"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    unit = Column(String, nullable=False)
    # total_cost will be a calculated property or method in Pydantic model/service layer
    project_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("projects.id"), nullable=True) # Can be global or project-specific
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="apus")
    items = relationship("APUItem", back_populates="apu", cascade="all, delete-orphan")
    budget_items = relationship("BudgetItem", back_populates="apu")

class APUItem(Base):
    __tablename__ = "apu_items"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    apu_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("apus.id"), nullable=False)
    resource_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("resources.id"), nullable=False)
    quantity = Column(Numeric(10, 4), nullable=False)
    cost_per_unit = Column(Numeric(10, 2), nullable=False) # Can be copied from resource or overridden at time of creation
    # total_cost will be quantity * cost_per_unit, calculated in service layer or Pydantic model

    apu = relationship("APU", back_populates="items")
    resource = relationship("Resource", back_populates="apu_items")

class Budget(Base):
    __tablename__ = "budgets"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False, default="Project Budget")
    version = Column(Integer, default=1)
    # total_amount will be a calculated sum of budget_items, handled in service layer or Pydantic model
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="budgets")
    items = relationship("BudgetItem", back_populates="budget", cascade="all, delete-orphan")

class BudgetItem(Base):
    __tablename__ = "budget_items"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    budget_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("budgets.id"), nullable=False)
    apu_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("apus.id"), nullable=False) # Or could be a direct resource/custom item
    quantity = Column(Numeric(10, 4), nullable=False)
    # unit_cost would be APU.total_cost at the time of adding
    # total_cost will be quantity * unit_cost, calculated
    description = Column(Text) # Optional, more specific description for this budget line item

    budget = relationship("Budget", back_populates="items")
    apu = relationship("APU", back_populates="budget_items")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    status = Column(String, default='todo') # e.g., 'todo', 'in_progress', 'completed', 'blocked'
    priority = Column(String, default='medium') # e.g., 'low', 'medium', 'high'
    start_date = Column(Date)
    due_date = Column(Date)
    assignee_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    parent_task_id = Column(SQLAlchemyUUID(as_uuid=True), ForeignKey("tasks.id"), nullable=True) # For subtasks
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks_assigned")
    parent_task = relationship("Task", remote_side=[id], back_populates="sub_tasks") # Self-referential for parent
    sub_tasks = relationship("Task", back_populates="parent_task", cascade="all, delete-orphan") # Self-referential for subtasks
