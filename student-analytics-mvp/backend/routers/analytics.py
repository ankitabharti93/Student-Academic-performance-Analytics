from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from database import get_db
from models import Grade, Enrollment, Course, Student, Attendance, User
from auth.router import get_current_user

router = APIRouter()


@router.get("/grade-distribution")
def grade_distribution(
    semester: Optional[str] = None,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Grade.grade_letter, func.count(Grade.id).label("count"))
    if semester:
        query = query.filter(Grade.semester == semester)
    if course_id:
        query = query.join(Enrollment).filter(Enrollment.course_id == course_id)
    results = query.group_by(Grade.grade_letter).all()
    return [{"grade": r.grade_letter, "count": r.count} for r in results]


@router.get("/gpa-trend")
def gpa_trend(
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Grade.semester, func.avg(Grade.marks).label("avg_marks"))
        .join(Enrollment)
    )
    if department:
        query = query.join(Student, Enrollment.student_id == Student.id).filter(
            Student.department == department
        )
    results = query.group_by(Grade.semester).order_by(Grade.semester).all()
    return [
        {"semester": r.semester, "avg_marks": round(r.avg_marks, 2)} for r in results
    ]


@router.get("/pass-fail")
def pass_fail(
    semester: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(
            Course.name.label("course_name"),
            func.sum(case((Grade.marks >= 40, 1), else_=0)).label("pass_count"),
            func.sum(case((Grade.marks < 40, 1), else_=0)).label("fail_count"),
        )
        .join(Enrollment, Course.id == Enrollment.course_id)
        .join(Grade, Grade.enrollment_id == Enrollment.id)
    )
    if semester:
        query = query.filter(Grade.semester == semester)
    results = query.group_by(Course.id).all()
    return [
        {
            "course": r.course_name,
            "pass": r.pass_count or 0,
            "fail": r.fail_count or 0,
        }
        for r in results
    ]


@router.get("/subject-averages")
def subject_averages(
    semester: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(
            Course.name.label("course_name"),
            func.avg(Grade.marks).label("avg_marks"),
        )
        .join(Enrollment, Course.id == Enrollment.course_id)
        .join(Grade, Grade.enrollment_id == Enrollment.id)
    )
    if semester:
        query = query.filter(Grade.semester == semester)
    results = query.group_by(Course.id).all()
    return [
        {"subject": r.course_name, "avg_marks": round(r.avg_marks, 2)}
        for r in results
    ]


@router.get("/attendance-summary")
def analytics_attendance_summary(
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
            "attendance_pct": round(
                (r.present_count or 0) / r.total * 100 if r.total else 0, 1
            ),
        }
        for r in results
    ]
