from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Course, User
from schemas import CourseCreate, CourseOut
from auth.router import get_current_user, require_teacher_or_admin, require_admin

router = APIRouter()


@router.get("/", response_model=List[CourseOut])
def list_courses(
    semester: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Course)
    if current_user.role == "teacher":
        query = query.filter(Course.teacher_id == current_user.id)
    if semester:
        query = query.filter(Course.semester == semester)
    return query.all()


@router.post("/", response_model=CourseOut)
def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    existing = db.query(Course).filter(Course.code == course_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course code already exists")
    course = Course(**course_in.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course
