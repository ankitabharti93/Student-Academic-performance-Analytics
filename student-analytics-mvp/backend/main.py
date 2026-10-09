from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models  # noqa: ensure all models are registered

from auth.router import router as auth_router
from routers.students import router as students_router
from routers.courses import router as courses_router
from routers.grades import router as grades_router
from routers.attendance import router as attendance_router
from routers.analytics import router as analytics_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Analytics API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(students_router, prefix="/api/students", tags=["students"])
app.include_router(courses_router, prefix="/api/courses", tags=["courses"])
app.include_router(grades_router, prefix="/api/grades", tags=["grades"])
app.include_router(attendance_router, prefix="/api/attendance", tags=["attendance"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["analytics"])


@app.get("/api/health")
def health():
    return {"status": "ok"}
