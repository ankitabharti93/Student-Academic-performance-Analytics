import { useEffect, useState } from 'react'
import { coursesApi } from '../api/courses'
import { gradesApi } from '../api/grades'
import { analyticsApi } from '../api/analytics'
import { useAuth } from '../context/AuthContext'
import type { Course, PassFailItem } from '../types'

export default function TeacherCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [passFail, setPassFail] = useState<PassFailItem[]>([])
  const [loading, setLoading] = useState(true)

  // Grade entry form
  const [enrollmentId, setEnrollmentId] = useState('')
  const [marks, setMarks] = useState('')
  const [assessmentType, setAssessmentType] = useState('final')
  const [semester, setSemester] = useState('2024-Spring')
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    Promise.all([coursesApi.list(), analyticsApi.passFail()])
      .then(([c, pf]) => { setCourses(c); setPassFail(pf) })
      .finally(() => setLoading(false))
  }, [])

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await gradesApi.create({
        enrollment_id: Number(enrollmentId),
        marks: Number(marks),
        assessment_type: assessmentType,
        semester,
      })
      setSubmitMsg('Grade saved successfully.')
      setEnrollmentId('')
      setMarks('')
    } catch {
      setSubmitMsg('Error saving grade. Check enrollment ID.')
    }
  }

  if (loading) return <div className="text-gray-500">Loading…</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Course list */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Assigned Courses</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Code</th>
                <th className="pb-2">Semester</th>
                <th className="pb-2">Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2 text-gray-500">{c.code}</td>
                  <td className="py-2">{c.semester}</td>
                  <td className="py-2">{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grade entry form */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Enter Grade</h3>
          <form onSubmit={handleGradeSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment ID</label>
              <input
                type="number"
                required
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 12"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Marks (0–100)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assessment Type</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2023-Fall">2023-Fall</option>
                <option value="2024-Spring">2024-Spring</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm"
            >
              Save Grade
            </button>
            {submitMsg && <p className="text-sm text-green-700">{submitMsg}</p>}
          </form>
        </div>
      </div>

      {/* Pass/Fail per course */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Course Pass / Fail Stats</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="pb-2">Course</th>
              <th className="pb-2 text-green-600">Pass</th>
              <th className="pb-2 text-red-500">Fail</th>
              <th className="pb-2">Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {passFail
              .filter((r) => courses.some((c) => c.name === r.course))
              .map((r) => {
                const rate = Math.round(r.pass / (r.pass + r.fail) * 100)
                return (
                  <tr key={r.course} className="border-b last:border-0">
                    <td className="py-2">{r.course}</td>
                    <td className="py-2 text-green-700 font-medium">{r.pass}</td>
                    <td className="py-2 text-red-600 font-medium">{r.fail}</td>
                    <td className="py-2">{rate}%</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
