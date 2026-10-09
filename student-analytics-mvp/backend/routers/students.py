from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Student, User, Enrollment, Grade, Attendance, Course
from schemas import StudentOut
from auth.router import get_current_user, require_teacher_or_admin

router = APIRouter()


def _build_performance(student_id: int, db: Session, current_user: User) -> dict:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if current_user.role == "student" and student.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    gpa_trend = (
        db.query(Grade.semester, func.avg(Grade.marks).label("avg_marks"))
        .join(Enrollment, Grade.enrollment_id == Enrollment.id)
        .filter(Enrollment.student_id == student_id)
        .group_by(Grade.semester)
        .order_by(Grade.semester)
        .all()
    )

    course_breakdown = (
        db.query(
            Course.name.label("course_name"),
            Course.code.label("course_code"),
            func.avg(Grade.marks).label("avg_marks"),
        )
        .join(Enrollment, Course.id == Enrollment.course_id)
        .join(Grade, Grade.enrollment_id == Enrollment.id)
        .filter(Enrollment.student_id == student_id)
        .group_by(Course.id)
        .all()
    )

    total_att = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.student_id == student_id)
        .scalar()
    )
    present_att = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.student_id == student_id, Attendance.present == True)
        .scalar()
    )
    attendance_pct = round((present_att / total_att * 100) if total_att else 0, 1)

    return {
        "student": {
            "id": student.id,
            "name": student.user.name,
            "email": student.user.email,
            "department": student.department,
            "program": student.program,
            "year_of_study": student.year_of_study,
        },
        "gpa_trend": [
            {"semester": r.semester, "avg_marks": round(r.avg_marks, 2)}
            for r in gpa_trend
        ],
        "course_breakdown": [
            {
                "course_name": r.course_name,
                "course_code": r.course_code,
                "avg_marks": round(r.avg_marks, 2),
            }
            for r in course_breakdown
        ],
        "attendance_pct": attendance_pct,
    }


@router.get("/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found for this user")
    return _build_performance(student.id, db, current_user)


@router.get("/", response_model=List[StudentOut])
def list_students(
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher_or_admin),
):
    query = db.query(Student)
    if department:
        query = query.filter(Student.department == department)
    return query.all()


@router.get("/{student_id}/performance")
def get_student_performance(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _build_performance(student_id, db, current_user)
