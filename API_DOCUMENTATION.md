# Agile Project Management Tool - API Documentation

The Agile Project Management API provides endpoints to manage Projects, User Stories, Tasks, Dashboard Analytics, and background Spring Scheduler workflows.

**Base URL**: `http://localhost:8080/api/v1`  
**Swagger UI Documentation**: `http://localhost:8080/swagger-ui.html`  
**OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

---

## Standard Response Structure

All endpoints return a consistent JSON response envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-08-04T20:00:00"
}
```

---

## 1. Project Management APIs (`/api/v1/projects`)

### A. Create Project
- **HTTP Method**: `POST /api/v1/projects`
- **Description**: Creates a new project in the system.
- **Request Body**:
  ```json
  {
    "name": "Enterprise E-Commerce Portal",
    "description": "Online shopping platform with microservices architecture.",
    "status": "IN_PROGRESS"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Project created successfully",
    "data": {
      "id": 1,
      "name": "Enterprise E-Commerce Portal",
      "description": "Online shopping platform with microservices architecture.",
      "status": "IN_PROGRESS",
      "createdAt": "2026-08-01T09:00:00",
      "updatedAt": "2026-08-01T09:00:00",
      "totalStories": 0,
      "totalTasks": 0,
      "completedTasks": 0,
      "completionPercentage": 0.0
    }
  }
  ```

### B. Update Project
- **HTTP Method**: `PUT /api/v1/projects/{id}`
- **Description**: Updates project details.
- **Path Parameter**: `id` (INTEGER, required)
- **Response**: `200 OK`

### C. Delete Project
- **HTTP Method**: `DELETE /api/v1/projects/{id}`
- **Description**: Deletes a project and recursively deletes all user stories and tasks inside it.
- **Response**: `200 OK`

### D. Get Project by ID (With Full Hierarchy)
- **HTTP Method**: `GET /api/v1/projects/{id}`
- **Description**: Fetches project details along with nested list of User Stories and Tasks.
- **Response**: `200 OK`

### E. Get All Projects
- **HTTP Method**: `GET /api/v1/projects`
- **Query Parameters**:
  - `search` (STRING, optional): Filter by project name keyword
  - `status` (STRING, optional): Filter by `PLANNED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`
- **Response**: `200 OK`

---

## 2. User Story Management APIs (`/api/v1/stories`)

### A. Create User Story
- **HTTP Method**: `POST /api/v1/stories`
- **Description**: Creates a new user story under an existing project.
- **Request Body**:
  ```json
  {
    "projectId": 1,
    "title": "User Authentication & JWT Auth",
    "description": "As a customer, I want to securely log in using email/password.",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "storyPoints": 5
  }
  ```
- **Response**: `201 Created`

### B. Update User Story
- **HTTP Method**: `PUT /api/v1/stories/{id}`
- **Description**: Updates details of an existing user story.
- **Response**: `200 OK`

### C. Delete User Story
- **HTTP Method**: `DELETE /api/v1/stories/{id}`
- **Description**: Deletes a user story and all tasks associated with it.
- **Response**: `200 OK`

### D. Get Story by ID
- **HTTP Method**: `GET /api/v1/stories/{id}`
- **Response**: `200 OK`

### E. List Stories by Project
- **HTTP Method**: `GET /api/v1/projects/{projectId}/stories`
- **Response**: `200 OK`

---

## 3. Task Management APIs (`/api/v1/tasks`)

### A. Create Task
- **HTTP Method**: `POST /api/v1/tasks`
- **Description**: Creates a new task under a specific user story.
- **Request Body**:
  ```json
  {
    "storyId": 101,
    "title": "Design User Entity & Auth Schema",
    "description": "Define database constraints and password hashing logic.",
    "status": "TODO",
    "priority": "HIGH",
    "assignee": "Sarah Jenkins",
    "dueDate": "2026-08-10"
  }
  ```
- **Response**: `201 Created`

### B. Update Task
- **HTTP Method**: `PUT /api/v1/tasks/{id}`
- **Response**: `200 OK`

### C. Delete Task
- **HTTP Method**: `DELETE /api/v1/tasks/{id}`
- **Response**: `200 OK`

### D. Get Task by ID
- **HTTP Method**: `GET /api/v1/tasks/{id}`
- **Response**: `200 OK`

### E. List Tasks by Story
- **HTTP Method**: `GET /api/v1/stories/{storyId}/tasks`
- **Response**: `200 OK`

### F. List All Tasks
- **HTTP Method**: `GET /api/v1/tasks`
- **Query Parameter**: `status` (`TODO`, `IN_PROGRESS`, `DONE`, `OVERDUE`)
- **Response**: `200 OK`

### G. Update Task Status (Kanban / Inline Transition)
- **HTTP Method**: `PATCH /api/v1/tasks/{id}/status`
- **Request Body**:
  ```json
  {
    "status": "DONE"
  }
  ```
- **Response**: `200 OK`

---

## 4. Dashboard & Async Scheduler APIs (`/api/v1/dashboard`)

### A. Get Dashboard Metrics
- **HTTP Method**: `GET /api/v1/dashboard/stats`
- **Description**: Returns total counts, status breakdowns, project completion progress summaries, and recent activity logs.

### B. Trigger Async Overdue Check
- **HTTP Method**: `POST /api/v1/dashboard/trigger-overdue-check`
- **Description**: Manually triggers the background Spring Scheduler workflow to check for overdue tasks, update status to `OVERDUE`, log events, and return an execution summary report.
