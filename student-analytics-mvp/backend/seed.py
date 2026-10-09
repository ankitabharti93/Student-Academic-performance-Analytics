"""
Seed script — run once from the backend/ directory:
    python seed.py
Idempotent: skips if admin user already exists.
"""
import random
from datetime import date, timedelta

from database import SessionLocal, engine, Base
import models
from auth.utils import get_password_hash

random.seed(42)

Base.metadata.create_all(bind=engine)

DEPARTMENTS = ["Computer Science", "Business Administration"]
PROGRAMS = {
    "Computer Science": ["BSc Computer Science", "BSc Software Engineering"],
    "Business Administration": ["BBA", "BSc Accounting"],
}
SEMESTERS = ["2023-Fall", "2024-Spring"]
ASSESSMENT_TYPES = ["midterm", "final", "assignment"]

def grade_letter(marks: float) -> str:
    if marks >= 90: return "A"
    if marks >= 75: return "B"
    if marks >= 60: return "C"
    if marks >= 40: return "D"
    return "F"


def realistic_marks() -> float:
    """Normal-ish distribution centred at 68, some failures."""
    m = random.gauss(68, 18)
    return round(max(0, min(100, m)), 1)


def main():
    db = SessionLocal()

    # --- Idempotency check ---
    if db.query(models.User).filter(models.User.email == "admin@school.edu").first():
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding database…")

    # --- Admin ---
    admin = models.User(
        name="Admin User",
        email="admin@school.edu",
        hashed_password=get_password_hash("admin123"),
        role="admin",
    )
    db.add(admin)
    db.flush()

    # --- Teachers ---
    teacher_data = [
        ("Alice Johnson", "teacher1@school.edu"),
        ("Bob Martinez", "teacher2@school.edu"),
        ("Carol Lee", "teacher3@school.edu"),
    ]
    teachers = []
    for name, email in teacher_data:
        t = models.User(
            name=name,
            email=email,
            hashed_password=get_password_hash("teacher123"),
            role="teacher",
        )
        db.add(t)
        teachers.append(t)
    db.flush()

    # --- Courses (6 total, 2 semesters) ---
    course_defs = [
        ("Data Structures", "CS101", 4, "2023-Fall", teachers[0].id),
        ("Calculus I",      "MA101", 3, "2023-Fall", teachers[1].id),
        ("Microeconomics",  "BA101", 3, "2023-Fall", teachers[2].id),
        ("Algorithms",      "CS201", 4, "2024-Spring", teachers[0].id),
        ("Statistics",      "MA201", 3, "2024-Spring", teachers[1].id),
        ("Marketing",       "BA201", 3, "2024-Spring", teachers[2].id),
    ]
    courses = []
    for name, code, credits, semester, tid in course_defs:
        c = models.Course(name=name, code=code, credits=credits, semester=semester, teacher_id=tid)
        db.add(c)
        courses.append(c)
    db.flush()

    # --- Students (20 total, split across departments) ---
    students = []
    for i in range(1, 21):
        dept = DEPARTMENTS[i % 2]
        prog = random.choice(PROGRAMS[dept])
        user = models.User(
            name=f"Student {i:02d}",
            email=f"student{i}@school.edu",
            hashed_password=get_password_hash("student123"),
            role="student",
        )
        db.add(user)
        db.flush()
        student = models.Student(
            user_id=user.id,
            department=dept,
            program=prog,
            year_of_study=random.choice([1, 2, 3, 4]),
        )
        db.add(student)
        students.append(student)
    db.flush()

    # --- Enrollments: every student in every course ---
    enrollments = {}  # (student_id, course_id) -> Enrollment
    for student in students:
        for course in courses:
            enr = models.Enrollment(student_id=student.id, course_id=course.id)
            db.add(enr)
            db.flush()
            enrollments[(student.id, course.id)] = enr

    # --- Grades: 3 assessments per enrollment ---
    for (sid, cid), enr in enrollments.items():
        semester = enr.course.semester
        for atype in ASSESSMENT_TYPES:
            marks = realistic_marks()
            grade = models.Grade(
                enrollment_id=enr.id,
                marks=marks,
                grade_letter=grade_letter(marks),
                assessment_type=atype,
                semester=semester,
            )
            db.add(grade)

    # --- Attendance: 60 days, ~85% attendance rate ---
    today = date.today()
    start_date = today - timedelta(days=59)
    all_dates = [start_date + timedelta(days=d) for d in range(60)]
    # skip weekends
    school_days = [d for d in all_dates if d.weekday() < 5]

    for student in students:
        for course in courses:
            for day in school_days:
                present = random.random() < 0.85
                att = models.Attendance(
                    student_id=student.id,
                    course_id=course.id,
                    date=day,
                    present=present,
                )
                db.add(att)

    db.commit()
    print(f"Seeded: 1 admin, 3 teachers, {len(students)} students, {len(courses)} courses.")
    print(f"  Enrollments: {len(enrollments)}")
    print(f"  Attendance days per student/course: {len(school_days)}")
    print("\nDemo credentials:")
    print("  Admin:   admin@school.edu    / admin123")
    print("  Teacher: teacher1@school.edu / teacher123")
    print("  Student: student1@school.edu / student123")
    db.close()


if __name__ == "__main__":
    main()
