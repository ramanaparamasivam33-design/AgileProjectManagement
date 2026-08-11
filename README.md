# AgileFlow - Full-Stack Agile Project Management Tool

A production-grade, enterprise-ready Full-Stack Agile Project Management Tool designed for small software development teams (3–10 users). Supports hierarchical work tracking (**Project → User Story → Task**), real-time progress analytics, an interactive Kanban board, dark mode, and an asynchronous background task scheduler.

---

## 🚀 Technology Stack

### Backend
- **Framework**: Spring Boot 3.4.2 (Java 21)
- **Persistence**: Spring Data JPA & SQLite Database (`sqlite-jdbc`)
- **Validation**: Spring Validation (`jakarta.validation`)
- **Async & Scheduling**: Spring Scheduler (`@Scheduled`, background overdue engine with retry logic)
- **Documentation**: OpenAPI 3.0 & Swagger UI (`springdoc-openapi`)
- **Utilities**: Lombok, Slf4j Logging

### Frontend
- **Framework**: React 19 + Vite 6
- **UI Library**: Material UI (MUI v6) with custom theme tokens
- **Routing**: React Router (v7)
- **State Management**: React Context API (`ThemeContext`, `NotificationContext`)
- **HTTP Client**: Axios with global error interceptors
- **Visuals**: Pure SVG dynamic status pie charts, progress bars, interactive Kanban board

---

## 🏗️ Hierarchical Work Model

```
Project (1)
  └── User Story (N)
        └── Task (N)
```

1. **Project**: High-level initiative (e.g., *Enterprise E-Commerce Portal*). Tracks overall completion percentage calculated automatically from child tasks.
2. **User Story**: Business feature specification with priority (`LOW`, `MEDIUM`, `HIGH`), status (`TODO`, `IN_PROGRESS`, `DONE`), and Story Points estimation.
3. **Task**: Actionable work item assigned to a developer with priority, due date, and status progression (`TODO`, `IN_PROGRESS`, `DONE`, `OVERDUE`).

---

## ⚡ Asynchronous / Background Scheduler Workflow

The system implements an automated asynchronous background engine powered by **Spring Scheduler**:

- **Execution Frequency**: Runs hourly (configurable via `app.scheduler.overdue-cron` in `application.yml`).
- **Overdue Task Detection**: Scans all active tasks where `dueDate < Today` AND `status != DONE`.
- **Automatic Status Mutation**: Updates status to `OVERDUE` and logs warnings.
- **Reporting & Telemetry**: Generates a structured JSON execution report containing timing, processed candidates, updated count, and retry telemetry.
- **Fault Tolerance & Retries**: Uses exponential backoff retry loop (up to 3 attempts) in case of lock contention or transient database errors.
- **Manual Trigger**: Exposed via REST endpoint `POST /api/v1/dashboard/trigger-overdue-check` for instant evaluation.

---

## 📁 Folder Structure

```
agile-project-manager/
├── backend/
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/agilepm/app/
│           │   ├── config/          # OpenApiConfig, WebConfig, DatabaseConfig
│           │   ├── controller/      # Project, UserStory, Task, Dashboard Controllers
│           │   ├── dto/             # Request & Response DTOs
│           │   ├── entity/          # Project, UserStory, Task JPA Entities
│           │   ├── enums/           # Status and Priority Enums
│           │   ├── exception/       # GlobalExceptionHandler & Custom Exceptions
│           │   ├── mapper/          # Entity <-> DTO Mappers
│           │   ├── repository/      # Spring Data JPA Repositories
│           │   ├── scheduler/       # OverdueTaskScheduler
│           │   ├── service/         # Business Logic Interfaces & Impls
│           │   └── AgileProjectManagerApplication.java
│           └── resources/
│               ├── application.yml
│               ├── schema.sql
│               └── data.sql
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/      # Common chips, dialogs, charts, forms
│       ├── contexts/        # ThemeContext (Dark/Light), NotificationContext
│       ├── layouts/         # Responsive MainLayout with Appbar & Drawer
│       ├── pages/           # Dashboard, Projects, ProjectDetails, Stories, Tasks, Kanban
│       ├── services/        # Axios API clients
│       ├── App.jsx
│       └── main.jsx
├── schema.sql
├── seed.sql
├── Postman_Collection.json
├── API_DOCUMENTATION.md
├── DATABASE_DIAGRAM.md
└── DESIGN_AND_EVALUATION_NOTES.md

```

---

## 🔧 Installation & Setup

### Prerequisites
- **Java 21** (or Java 17+)
- **Node.js 18+** & **npm**

### 1. Backend Setup
```bash
cd backend

# Run Spring Boot application
./mvnw spring-boot:run
```
- Server will start on `http://localhost:8080`
- Swagger UI available at `http://localhost:8080/swagger-ui.html`

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```
- App will run on `http://localhost:5173`

---

## 🔒 Security Considerations
1. **CORS Policy**: Configured strictly in `WebConfig` to permit requested frontend origins (`http://localhost:5173`).
2. **SQL Injection Prevention**: Parameterized queries via Spring Data JPA and Hibernate.
3. **Input Validation**: JSR-380 bean validation (`@NotBlank`, `@Size`, `@NotNull`, `@Min`) on DTOs.
4. **Global Exception Handling**: Sanitized error responses via `GlobalExceptionHandler` preventing internal stack trace leaks.

---

## 🤖 AI Usage Note
AI tools were utilized during architecture planning, DTO modeling, and frontend component composition to optimize code structure, ensure clean layered separation, and build custom SVG charts.

---

## 🔮 Future Improvements
- Add JWT Authentication & OAuth2 Social Login.
- Add Role-Based Access Control (Admin, Scrum Master, Developer).
- Add WebSocket real-time collaboration updates.
- File attachments and comment threads on Tasks.

---

## 🎦 Project Videos

https://github.com/user-attachments/assets/c5688d2a-478e-4c5a-af39-bde68dd69e18

https://github.com/user-attachments/assets/786c11ec-a9da-47ee-9c9d-977e3a2feee6



