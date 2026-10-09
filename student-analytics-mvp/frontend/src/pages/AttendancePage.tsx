import { useEffect, useState } from 'react'
import { analyticsApi } from '../api/analytics'
import { coursesApi } from '../api/courses'
import AttendanceChart from '../components/charts/AttendanceChart'
import type { AttendanceSummaryItem, Course } from '../types'

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceSummaryItem[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [courseId, setCourseId] = useState('')
  const [dept, setDept] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coursesApi.list().then(setCourses)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string | number> = {}
    if (courseId) params.course_id = Number(courseId)
    if (dept) params.department = dept
    analyticsApi.attendanceSummary(params as { course_id?: number; department?: string })
      .then(setData)
      .finally(() => setLoading(false))
  }, [courseId, dept])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance</h2>

      <div className="flex gap-3 mb-4">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
          ))}
        </select>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Business Administration">Business Administration</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Attendance % per Student{' '}
          <span className="font-normal text-gray-400">(dashed line = 75% threshold)</span>
        </h3>
        {loading ? <p className="text-gray-400">Loading…</p> : <AttendanceChart data={data} />}
      </div>
    </div>
  )
}
