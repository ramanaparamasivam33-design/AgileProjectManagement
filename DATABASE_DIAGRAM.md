# Agile Project Management System - Database Architecture & ERD

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PROJECT ||--o{ USER_STORY : "contains (1 to Many)"
    USER_STORY ||--o{ TASK : "contains (1 to Many)"

    PROJECT {
        int id PK
        string name
        string description
        string status
        timestamp created_at
        timestamp updated_at
    }

    USER_STORY {
        int id PK
        int project_id FK
        string title
        string description
        string priority
        string status
        int story_points
        timestamp created_at
        timestamp updated_at
    }

    TASK {
        int id PK
        int story_id FK
        string title
        string description
        string status
        string priority
        string assignee
        date due_date
        timestamp created_at
        timestamp updated_at
    }
```

---

## Data Model Specifications

### 1. `projects` Table
- **Primary Key**: `id` (INTEGER AUTOINCREMENT)
- **Relationships**: Parent of `user_stories`. On Delete Cascade deletes all related user stories.
- **Constraints**: `name` NOT NULL.

### 2. `user_stories` Table
- **Primary Key**: `id` (INTEGER AUTOINCREMENT)
- **Foreign Key**: `project_id` REFERENCES `projects(id)` ON DELETE CASCADE.
- **Relationships**: Parent of `tasks`.
- **Enums**:
  - `priority`: `LOW`, `MEDIUM`, `HIGH`
  - `status`: `TODO`, `IN_PROGRESS`, `DONE`

### 3. `tasks` Table
- **Primary Key**: `id` (INTEGER AUTOINCREMENT)
- **Foreign Key**: `story_id` REFERENCES `user_stories(id)` ON DELETE CASCADE.
- **Enums**:
  - `status`: `TODO`, `IN_PROGRESS`, `DONE`, `OVERDUE`
  - `priority`: `LOW`, `MEDIUM`, `HIGH`
