// Core entities

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
}

export interface Student {
  id: number
  user_id: number
  department: string
  program: string
  year_of_study: number
  user: User
}

export interface Course {
  id: number
  name: string
  code: string
  credits: number
  semester: string
  teacher_id: number
}

export interface Grade {
  id: number
  enrollment_id: number
  marks: number
  grade_letter: string
  assessment_type: string
  semester: string
}

export interface Attendance {
  id: number
  student_id: number
  course_id: number
  date: string
  present: boolean
}

// Analytics response shapes

export interface GpaPoint {
  semester: string
  avg_marks: number
}

export interface GradeDistItem {
  grade: string
  count: number
}

export interface PassFailItem {
  course: string
  pass: number
  fail: number
}

export interface SubjectAvgItem {
  subject: string
  avg_marks: number
}

export interface AttendanceSummaryItem {
  student_id: number
  student_name: string
  attendance_pct: number
}

export interface StudentPerformance {
  student: {
    id: number
    name: string
    email: string
    department: string
    program: string
    year_of_study: number
  }
  gpa_trend: GpaPoint[]
  course_breakdown: { course_name: string; course_code: string; avg_marks: number }[]
  attendance_pct: number
}

// Auth

export interface Token {
  access_token: string
  token_type: string
}
