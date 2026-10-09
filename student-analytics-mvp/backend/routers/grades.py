from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Grade, Enrollment, User
from schemas import GradeCreate, GradeOut
from auth.router import get_current_user, require_teacher_or_admin

router = APIRouter()


def _grade_letter(marks: float) -> str:
    if marks >= 90:
        return "A"
    elif marks >= 75:
        return "B"
    elif marks >= 60:
        return "C"
    elif marks >= 40:
        return "D"
    return "F"


@router.post("/", response_model=GradeOut)
def create_grade(
    grade_in: GradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher_or_admin),
):
    enrollment = db.query(Enrollment).filter(Enrollment.id == grade_in.enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    grade = Grade(
        enrollment_id=grade_in.enrollment_id,
        marks=grade_in.marks,
        grade_letter=_grade_letter(grade_in.marks),
        assessment_type=grade_in.assessment_type,
        semester=grade_in.semester,
    )
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade


@router.get("/", response_model=List[GradeOut])
def list_grades(
    course_id: Optional[int] = None,
    student_id: Optional[int] = None,
    semester: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Grade).join(Enrollment)
    if course_id:
        query = query.filter(Enrollment.course_id == course_id)
    if student_id:
        query = query.filter(Enrollment.student_id == student_id)
    if semester:
        query = query.filter(Grade.semester == semester)
    return query.all()
