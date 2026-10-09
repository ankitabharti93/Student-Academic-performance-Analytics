# Student Academic Performance Analytics — MVP

A full-stack web application for student academic performance analytics, running entirely on localhost.

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Backend  | Python 3.11+, FastAPI, SQLAlchemy, SQLite         |
| Frontend | React 18, TypeScript, Vite, Recharts, Tailwind CSS |
| Auth     | JWT (python-jose), bcrypt (passlib)               |

---

## Quick Start

### 1 — Backend

```bash
cd student-analytics-mvp/backend

# Create & activate a virtual environment (recommended)
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with demo data
python seed.py

# Start the API server
uvicorn main:app --reload
```

Backend is now running at **http://localhost:8000**  
Swagger UI (API docs): **http://localhost:8000/docs**

---

### 2 — Frontend

Open a **new terminal**:

```bash
cd student-analytics-mvp/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend is now running at **http://localhost:5173**

---

## Demo Credentials

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Admin   | admin@school.edu         | admin123     |
| Teacher | teacher1@school.edu      | teacher123   |
| Student | student1@school.edu      | student123   |

---

## Features by Role

### Admin
- **Dashboard** — KPI cards (total students, courses, pass rate, avg GPA), grade distribution bar chart, GPA trend line chart, pass/fail pie chart
- **Students** — searchable & filterable student table with links to individual profiles
- **Subjects** — horizontal bar chart of mean marks per subject, semester filter
- **Attendance** — attendance % per student with course/department filters

### Teacher
- **Dashboard** — same analytics overview
- **My Courses** — list of assigned courses, grade entry form, per-course pass/fail stats
- **Attendance** — attendance charts filtered to their courses

### Student
- **My Profile** — GPA trend, course-by-course grade breakdown, attendance percentage

---

## Project Structure

```
student-analytics-mvp/
├── backend/
│   ├── main.py               # FastAPI app, CORS, router registration
│   ├── database.py           # SQLAlchemy engine + session + get_db
│   ├── models.py             # ORM: User, Student, Course, Enrollment, Grade, Attendance
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── seed.py               # Demo data seed (idempotent)
│   ├── auth/
│   │   ├── router.py         # POST /api/auth/login, GET /api/auth/me
│   │   └── utils.py          # JWT encode/decode, bcrypt hashing
│   └── routers/
│       ├── students.py       # CRUD + /me + /{id}/performance
│       ├── courses.py        # Course list + create
│       ├── grades.py         # Grade entry + list
│       ├── attendance.py     # Mark attendance + summary
│       └── analytics.py      # 5 aggregation endpoints
└── frontend/
    ├── index.html
    ├── vite.config.ts        # /api proxy → http://localhost:8000
    ├── tailwind.config.js
    └── src/
        ├── App.tsx           # BrowserRouter + protected routes
        ├── main.tsx
        ├── index.css         # Tailwind directives
        ├── api/              # Typed Axios API wrappers
        ├── components/       # Sidebar, KpiCard, ProtectedRoute, charts/
        ├── context/          # AuthContext (JWT + role)
        ├── pages/            # LoginPage, AdminDashboard, StudentsPage, …
        └── types/            # TypeScript interfaces
```

---

## API Endpoints

| Method | Path                              | Auth          | Description                      |
|--------|-----------------------------------|---------------|----------------------------------|
| POST   | /api/auth/login                   | —             | Login, returns JWT               |
| GET    | /api/auth/me                      | Any           | Current user profile             |
| GET    | /api/students/                    | Admin/Teacher | List all students                |
| GET    | /api/students/me                  | Student       | Own performance profile          |
| GET    | /api/students/{id}/performance    | Any*          | Student performance detail       |
| GET    | /api/courses/                     | Any           | List courses (teacher sees own)  |
| POST   | /api/courses/                     | Admin         | Create course                    |
| GET    | /api/grades/                      | Any           | List grades                      |
| POST   | /api/grades/                      | Teacher/Admin | Create grade entry               |
| GET    | /api/attendance/summary           | Any           | Attendance % per student         |
| POST   | /api/attendance/                  | Teacher/Admin | Mark attendance                  |
| GET    | /api/analytics/grade-distribution | Any           | Grade letter counts              |
| GET    | /api/analytics/gpa-trend          | Any           | Avg marks per semester           |
| GET    | /api/analytics/pass-fail          | Any           | Pass/fail per course             |
| GET    | /api/analytics/subject-averages   | Any           | Mean marks per subject           |
| GET    | /api/analytics/attendance-summary | Any           | Attendance % per student         |

*Students can only view their own profile.

---

## Grade Scale

| Letter | Marks Range |
|--------|-------------|
| A      | ≥ 90        |
| B      | ≥ 75        |
| C      | ≥ 60        |
| D      | ≥ 40        |
| F      | < 40 (fail) |

Pass threshold: **marks ≥ 40**

---

## Notes

- The SQLite database file is created at `backend/analytics.db` when the server first starts.
- Re-running `python seed.py` is safe — it checks for existing data and skips if already seeded.
- The Vite dev server proxies all `/api/*` requests to `http://localhost:8000`, so no CORS issues in development.
- JWT tokens expire after **8 hours**.
