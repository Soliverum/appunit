# AppUnit Database Schema Definition

This document outlines the conceptual database schema for AppUnit, focusing on PostgreSQL.

## Tables

### `users`
Stores user information.
- `id` (Primary Key, UUID)
- `username` (String, unique, not nullable)
- `email` (String, unique, not nullable)
- `hashed_password` (String, not nullable)
- `full_name` (String)
- `role` (String, e.g., 'admin', 'project_manager', 'user')
- `is_active` (Boolean, default True)
- `created_at` (Timestamp, default now)
- `updated_at` (Timestamp, default now, updates on change)

### `projects`
Stores project information.
- `id` (Primary Key, UUID)
- `name` (String, not nullable)
- `description` (Text)
- `status` (String, e.g., 'planning', 'in_progress', 'completed', 'on_hold')
- `start_date` (Date)
- `end_date` (Date)
- `budget` (Numeric)
- `currency` (String, e.g., 'USD', 'EUR', 'MXN')
- `owner_id` (Foreign Key to `users.id`)
- `created_at` (Timestamp, default now)
- `updated_at` (Timestamp, default now, updates on change)

### `resources`
Stores information about resources (labor, materials, equipment).
- `id` (Primary Key, UUID)
- `name` (String, not nullable)
- `description` (Text)
- `type` (String, e.g., 'labor', 'material', 'equipment', 'subcontract')
- `unit` (String, e.g., 'hour', 'sqm', 'piece', 'day')
- `unit_cost` (Numeric, not nullable)
- `currency` (String, e.g., 'USD', 'EUR', 'MXN')
- `supplier` (String)
- `created_at` (Timestamp, default now)
- `updated_at` (Timestamp, default now, updates on change)

### `apus` (Análisis de Precios Unitarios - Unit Price Analysis)
- `id` (Primary Key, UUID)
- `code` (String, unique, not nullable)
- `description` (Text, not nullable)
- `unit` (String, not nullable)
- `total_cost` (Numeric, calculated, not nullable)
- `project_id` (Foreign Key to `projects.id`, optional, if APUs can be project-specific or global)
- `created_at` (Timestamp, default now)
- `updated_at` (Timestamp, default now, updates on change)

### `apu_items`
Line items within an APU (linking resources to an APU).
- `id` (Primary Key, UUID)
- `apu_id` (Foreign Key to `apus.id`, not nullable)
- `resource_id` (Foreign Key to `resources.id`, not nullable)
- `quantity` (Numeric, not nullable)
- `cost_per_unit` (Numeric, can be copied from resource or overridden)
- `total_cost` (Numeric, calculated, not nullable)

### `budgets`
Stores budget information for projects, likely composed of multiple APUs.
- `id` (Primary Key, UUID)
- `project_id` (Foreign Key to `projects.id`, not nullable)
- `name` (String, not nullable, e.g., "Initial Budget", "Phase 1 Budget")
- `version` (Integer, default 1)
- `total_amount` (Numeric, calculated)
- `created_at` (Timestamp, default now)
- `updated_at` (Timestamp, default now, updates on change)

### `budget_items`
Line items within a budget, linking APUs to a budget.
- `id` (Primary Key, UUID)
- `budget_id` (Foreign Key to `budgets.id`, not nullable)
- `apu_id` (Foreign Key to `apus.id`, not nullable)
- `quantity` (Numeric, not nullable)
- `unit_cost` (Numeric, from APU's total_cost)
- `total_cost` (Numeric, calculated)
- `description` (Text, optional, can be more specific for this budget item)

### `tasks`
For task management (Kanban/Gantt).
- `id` (Primary Key, UUID)
- `project_id` (Foreign Key to `projects.id`, not nullable)
- `name` (String, not nullable)
- `description` (Text)
- `status` (String, e.g., 'todo', 'in_progress', 'completed', 'blocked')
- `priority` (String, e.g., 'low', 'medium', 'high')
- `start_date` (Date)
- `due_date` (Date)
- `assigned_to_id` (Foreign Key to `users.id`, optional)
- `parent_task_id` (Foreign Key to `tasks.id`, optional, for subtasks)
- `created_at` (Timestamp, default now)
- `updated_at` (Timestamp, default now, updates on change)
```
This detailed schema will guide the implementation of SQLAlchemy models in the next step.
