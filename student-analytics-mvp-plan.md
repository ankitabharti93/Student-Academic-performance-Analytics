# Student Academic Performance Analytics — MVP Plan

## Top-Level Overview

Build a full-stack web application for student academic performance analytics, running entirely on localhost.

- **Backend**: Python 3.11+ with FastAPI, SQLAlchemy ORM, SQLite database
- **Frontend**: React 18 + TypeScript, Recharts for visualizations, Tailwind CSS for styling
- **Auth**: JWT-based authentication with three roles — Admin, Teacher, Student
- **Data**: SQLite file-based database with a seed script providing realistic demo data
- **Goal**: A working MVP dashboard with grade analytics, GPA trends, attendance tracking, and subject averages — no AI/ML, pure aggregation-based analytics

---

## Architecture Overview

```
student-analytics-mvp/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # SQLAlchemy engine + session
│   ├── models.py             # ORM models
│   ├── schemas.py            # Pydantic schemas
│   ├── seed.py               # Demo data seed script
│   ├── auth/
│   │   ├── router.py         # Login / token endpoints
│   │   └── utils.py          # JWT encode/decode, password hashing
│   └── routers/
│       ├── students.py       # Student CRUD + analytics
│       ├── courses.py        # Course endpoints
│       ├── grades.py         # Grade entry + aggregations
│       └── attendance.py     # Attendance endpoints + stats
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client + typed API calls
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── context/          # AuthContext for role/token
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Router + protected routes
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Data Model

| Table         | Key Columns                                                             |
|---------------|-------------------------------------------------------------------------|
| `users`       | id, name, email, hashed_password, role (admin/teacher/student)         |
| `students`    | id, user_id (FK), department, program, year_of_study                   |
| `courses`     | id, name, code, credits, semester, teacher_id (FK)                     |
| `enrollments` | id, student_id (FK), course_id (FK)                                    |
| `grades`      | id, enrollment_id (FK), marks, grade_letter, assessment_type, semester |
| `attendance`  | id, student_id (FK), course_id (FK), date, present (bool)              |

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding

**Status**: [ ] pending

**Intent**
Create the base folder structure, configuration files, and dependency manifests for both backend and frontend. This establishes the foundation all subsequent sub-tasks build upon.

**Expected Outcomes**
- `backend/` directory with `requirements.txt` listing all Python dependencies
- `frontend/` directory initialized as a Vite + React + TypeScript project
- `frontend/` configured with Tailwind CSS
- A root `README.md` with instructions for running both servers locally

**Todo List**
1. Create `backend/` directory and `requirements.txt` with: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic[email]`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`
2. Create `frontend/` using Vite template: `npm create vite@latest frontend -- --template react-ts`
3. Install frontend dependencies: `recharts`, `axios`, `react-router-dom`, `@types/react-router-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`
4. Initialize Tailwind CSS config in `frontend/`
5. Create root `README.md` with step-by-step local run instructions

**Relevant Context**
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:5173`
- Vite dev server proxies `/api` to `http://localhost:8000` to avoid CORS issues during development

---

### Sub-Task 2 — Backend Database Models and Configuration

**Status**: [ ] pending

**Intent**
Define the SQLAlchemy ORM models and database connection setup. This is the single source of truth for the data schema and must be completed before any API logic is written.

**Expected Outcomes**
- `backend/database.py` — SQLAlchemy engine pointing to `./analytics.db`, session factory, `Base` declarative base
- `backend/models.py` — all six ORM models: `User`, `Student`, `Course`, `Enrollment`, `Grade`, `Attendance`
- Database tables auto-created on app startup via `Base.metadata.create_all()`

**Todo List**
1. Write `backend/database.py` — create SQLite engine, `SessionLocal`, `Base`, and a `get_db` dependency
2. Write `backend/models.py` — define all six models with correct relationships and foreign keys
3. Wire `Base.metadata.create_all(bind=engine)` into `backend/main.py` startup

**Relevant Context**
- SQLite file will be `backend/analytics.db`
- All models import from `backend/database.py`
- Use `relationship()` for ORM joins between Student ↔ Enrollment ↔ Grade and Student ↔ Attendance

---

### Sub-Task 3 — Authentication (JWT + Roles)

**Status**: [ ] pending

**Intent**
Implement JWT-based login and role-based access control so that Admin, Teacher, and Student users each see only the data and pages relevant to their role.

**Expected Outcomes**
- `POST /api/auth/login` returns a JWT access token
- `GET /api/auth/me` returns the current user's profile and role
- FastAPI `Depends` utilities: `get_current_user`, `require_admin`, `require_teacher`
- Passwords stored as bcrypt hashes

**Todo List**
1. Write `backend/auth/utils.py` — password hashing with `passlib`, JWT encode/decode with `python-jose`, secret key from a config constant
2. Write `backend/schemas.py` — Pydantic schemas for `UserCreate`, `UserOut`, `Token`, `TokenData`
3. Write `backend/auth/router.py` — `POST /login` endpoint that validates credentials and returns JWT, `GET /me` endpoint
4. Add dependency functions `get_current_user(token)`, `require_role(role)` reusable across all routers
5. Register `auth.router` in `main.py` under prefix `/api/auth`

**Relevant Context**
- JWT secret key stored as a constant in `auth/utils.py` for MVP (no env file required for localhost)
- Token expiry: 8 hours (suitable for a single workday demo session)
- Role values: `"admin"`, `"teacher"`, `"student"` stored as strings in `users.role`

---

### Sub-Task 4 — Backend API Routers

**Status**: [ ] pending

**Intent**
Build all REST API endpoints for students, courses, grades, and attendance — including the aggregation queries that power the dashboard charts.

**Expected Outcomes**
- `GET /api/students/` — list all students (admin/teacher only)
- `GET /api/students/{id}/performance` — GPA trend, course breakdown, attendance % for one student
- `GET /api/courses/` — list courses; teacher sees only their own
- `POST /api/grades/` — create a grade entry (teacher only)
- `GET /api/analytics/grade-distribution` — grade letter counts across all/filtered courses
- `GET /api/analytics/gpa-trend` — average GPA per semester
- `GET /api/analytics/pass-fail` — pass/fail ratio per course
- `GET /api/analytics/subject-averages` — mean marks per subject
- `GET /api/analytics/attendance-summary` — attendance % per student or course
- All list endpoints support query params: `semester`, `department`, `course_id`

**Todo List**
1. Write `backend/routers/students.py` — CRUD + individual performance aggregation query
2. Write `backend/routers/courses.py` — list and create courses
3. Write `backend/routers/grades.py` — create grade entry, list by course/student
4. Write `backend/routers/attendance.py` — mark attendance, attendance % aggregations
5. Write `backend/routers/analytics.py` — all five aggregation endpoints using SQLAlchemy `func.avg`, `func.count`, `group_by`
6. Register all routers in `main.py` under `/api` prefix
7. Add CORS middleware in `main.py` allowing `http://localhost:5173`

**Relevant Context**
- All analytics endpoints use SQLAlchemy aggregate functions — no raw SQL strings
- Pass/fail threshold: marks >= 40 is pass
- Grade letters: A (>=90), B (>=75), C (>=60), D (>=40), F (<40)

---

### Sub-Task 5 — Seed Script with Demo Data

**Status**: [ ] pending

**Intent**
Populate the SQLite database with realistic demo data so the dashboard is fully populated on first launch without any manual data entry.

**Expected Outcomes**
- Running `python seed.py` from `backend/` creates all demo records
- Demo data includes: 3 teachers, 1 admin, 20 students across 2 departments
- 6 courses, 2 semesters of grades for all students, attendance records for 60 days
- Seed is idempotent — safe to run multiple times without duplicating data

**Todo List**
1. Write `backend/seed.py` — create users (admin + 3 teachers + 20 students)
2. Create 6 courses assigned to teachers, 2 semesters
3. Enroll all students in all courses
4. Generate grade records with realistic score distribution (normal-ish distribution, some failures)
5. Generate attendance records for last 60 days with ~85% average attendance rate
6. Add a check at top of seed: skip if data already exists

**Relevant Context**
- Use Python's `random` module with a fixed seed (`random.seed(42)`) for reproducible data
- Student departments: "Computer Science" and "Business Administration"
- Demo admin login: `admin@school.edu / admin123`
- Demo teacher login: `teacher1@school.edu / teacher123`
- Demo student login: `student1@school.edu / student123`

---

### Sub-Task 6 — Frontend Auth, Routing, and API Client

**Status**: [ ] pending

**Intent**
Set up the React application shell — typed API client, auth context, protected routes, and navigation — so all subsequent pages have a consistent foundation.

**Expected Outcomes**
- `src/api/client.ts` — Axios instance with base URL and JWT Authorization header injected from localStorage
- `src/context/AuthContext.tsx` — provides `user`, `token`, `login()`, `logout()` to the whole app
- `src/App.tsx` — React Router v6 routes with `ProtectedRoute` component that redirects to `/login` if unauthenticated
- Login page at `/login` with email + password form
- Navigation sidebar showing role-appropriate links

**Todo List**
1. Write `src/types/index.ts` — TypeScript interfaces for `User`, `Student`, `Course`, `Grade`, `Attendance`, all API response shapes
2. Write `src/api/client.ts` — Axios instance, request interceptor adds Bearer token, 401 interceptor calls logout
3. Write `src/api/auth.ts`, `students.ts`, `courses.ts`, `grades.ts`, `analytics.ts` — typed API call functions
4. Write `src/context/AuthContext.tsx` — login stores token+user in localStorage, logout clears it
5. Write `src/components/ProtectedRoute.tsx` — redirects to `/login` if no token; optionally checks role
6. Write `src/components/Sidebar.tsx` — navigation links filtered by role
7. Write `src/pages/LoginPage.tsx` — form with validation, calls `auth.login()`, redirects on success
8. Wire all routes in `src/App.tsx`

**Relevant Context**
- Vite proxy config in `vite.config.ts`: proxy `/api` → `http://localhost:8000`
- Token stored in `localStorage` under key `"access_token"`
- Three role-based nav sets: Admin sees all, Teacher sees courses/grades, Student sees own dashboard

---

### Sub-Task 7 — Dashboard Pages and Charts

**Status**: [ ] pending

**Intent**
Build the actual analytics dashboard pages — the visual core of the MVP — using Recharts for all chart components.

**Expected Outcomes**
- **Admin Dashboard** (`/dashboard`) — 4 KPI cards + grade distribution bar chart + GPA trend line chart + pass/fail pie chart
- **Subject Averages Page** (`/subjects`) — horizontal bar chart of mean marks per subject
- **Attendance Page** (`/attendance`) — attendance % per student as a bar chart, with a course filter
- **Student Profile Page** (`/students/:id`) — GPA trend line, course-by-course grade table, attendance % ring chart
- **Students List Page** (`/students`) — searchable, sortable table of all students with GPA column
- **Teacher View** (`/my-courses`) — grade entry form + course-level stats

**Todo List**
1. Write reusable `src/components/charts/` components: `GradeDistributionChart`, `GpaTrendChart`, `PassFailChart`, `SubjectAveragesChart`, `AttendanceChart` — each accepts typed props and uses Recharts
2. Write `src/components/KpiCard.tsx` — displays a metric label + value + optional trend indicator
3. Write `src/pages/AdminDashboard.tsx` — fetches all analytics endpoints, renders KPI cards and charts
4. Write `src/pages/SubjectsPage.tsx` — subject averages chart with semester filter
5. Write `src/pages/AttendancePage.tsx` — attendance bar chart with course/department filter
6. Write `src/pages/StudentsPage.tsx` — searchable table, link to individual profile
7. Write `src/pages/StudentProfilePage.tsx` — individual student analytics view
8. Write `src/pages/TeacherCoursesPage.tsx` — grade entry form + course stats for teacher role

**Relevant Context**
- All charts use Recharts: `BarChart`, `LineChart`, `PieChart`, `ResponsiveContainer`
- Use `useEffect` + `useState` for data fetching on each page (no external state management library needed for MVP)
- Filter dropdowns use semester/department values fetched from backend

---

### Sub-Task 8 — Integration, Local Run Verification, and README

**Status**: [ ] pending

**Intent**
Verify the full stack works end-to-end on localhost, fix any integration issues, and produce clear run instructions so anyone can start the app with two commands.

**Expected Outcomes**
- Backend starts cleanly with `uvicorn main:app --reload` from `backend/`
- Frontend starts cleanly with `npm run dev` from `frontend/`
- Seed script runs and populates the database
- All three role logins work and show appropriate dashboards
- All five chart types render with real data
- `README.md` contains complete setup and run instructions

**Todo List**
1. Run `python seed.py` and verify database is populated
2. Run backend and test all analytics endpoints via `http://localhost:8000/docs` (FastAPI Swagger UI)
3. Run frontend and verify login, role routing, and all dashboard pages load without errors
4. Fix any CORS, proxy, or type errors discovered during integration
5. Update `README.md` with final verified run steps, demo credentials, and port info

**Relevant Context**
- FastAPI auto-generates Swagger UI at `http://localhost:8000/docs` — useful for manual endpoint testing
- Common issues to check: Vite proxy not forwarding cookies, SQLite file path relative to where uvicorn is launched, CORS origin must exactly match `http://localhost:5173`

---

## Demo Credentials

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Admin   | admin@school.edu         | admin123     |
| Teacher | teacher1@school.edu      | teacher123   |
| Student | student1@school.edu      | student123   |

---

## Local Run Summary

```bash
# Backend
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
# → http://localhost:8000
# → Swagger UI: http://localhost:8000/docs

# Frontend (new terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```
