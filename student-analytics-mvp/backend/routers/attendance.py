from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from database import get_db
from models import Attendance, User, Student, Course
from schemas import AttendanceCreate, AttendanceOut
from auth.router import get_current_user, require_teacher_or_admin

router = APIRouter()


@router.post("/", response_model=AttendanceOut)
def mark_attendance(
    att_in: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher_or_admin),
):
    att = Attendance(
        student_id=att_in.student_id,
        course_id=att_in.course_id,
        date=date.fromisoformat(att_in.date),
        present=att_in.present,
    )
    db.add(att)
    db.commit()
    db.refresh(att)
    return {
        "id": att.id,
        "student_id": att.student_id,
        "course_id": att.course_id,
        "date": str(att.date),
        "present": att.present,
    }


@router.get("/summary")
def attendance_summary(
    course_id: Optional[int] = None,
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(
            Student.id.label("student_id"),
            User.name.label("student_name"),
            func.count(Attendance.id).label("total"),
            func.sum(case((Attendance.present == True, 1), else_=0)).label("present_count"),
        )
        .join(User, Student.user_id == User.id)
        .join(Attendance, Attendance.student_id == Student.id)
    )
    if course_id:
        query = query.filter(Attendance.course_id == course_id)
    if department:
        query = query.filter(Student.department == department)
    results = query.group_by(Student.id).all()

    return [
        {
            "student_id": r.student_id,
            "student_name": r.student_name,
            "total": r.total,
            "present": r.present_count or 0,
            "attendance_pct": round(
                (r.present_count or 0) / r.total * 100 if r.total else 0, 1
            ),
        }
        for r in results
    ]
