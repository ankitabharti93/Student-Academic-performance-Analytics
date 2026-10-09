from typing import Optional
from pydantic import BaseModel, EmailStr


# --- User schemas ---

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# --- Auth schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None


# --- Student schemas ---

class StudentOut(BaseModel):
    id: int
    user_id: int
    department: str
    program: str
    year_of_study: int
    user: UserOut

    class Config:
        from_attributes = True


# --- Course schemas ---

class CourseCreate(BaseModel):
    name: str
    code: str
    credits: int = 3
    semester: str
    teacher_id: int


class CourseOut(BaseModel):
    id: int
    name: str
    code: str
    credits: int
    semester: str
    teacher_id: int

    class Config:
        from_attributes = True


# --- Grade schemas ---

class GradeCreate(BaseModel):
    enrollment_id: int
    marks: float
    assessment_type: str
    semester: str


class GradeOut(BaseModel):
    id: int
    enrollment_id: int
    marks: float
    grade_letter: str
    assessment_type: str
    semester: str

    class Config:
        from_attributes = True


# --- Attendance schemas ---

class AttendanceCreate(BaseModel):
    student_id: int
    course_id: int
    date: str
    present: bool = True


class AttendanceOut(BaseModel):
    id: int
    student_id: int
    course_id: int
    date: str
    present: bool

    class Config:
        from_attributes = True
