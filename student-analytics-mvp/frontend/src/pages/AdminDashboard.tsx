import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard'
import GradeDistributionChart from '../components/charts/GradeDistributionChart'
import GpaTrendChart from '../components/charts/GpaTrendChart'
import PassFailChart from '../components/charts/PassFailChart'
import { analyticsApi } from '../api/analytics'
import { studentsApi } from '../api/students'
import { coursesApi } from '../api/courses'
import type { GradeDistItem, GpaPoint, PassFailItem } from '../types'

export default function AdminDashboard() {
  const [gradeDist, setGradeDist] = useState<GradeDistItem[]>([])
  const [gpaTrend, setGpaTrend] = useState<GpaPoint[]>([])
  const [passFail, setPassFail] = useState<PassFailItem[]>([])
  const [studentCount, setStudentCount] = useState(0)
  const [courseCount, setCourseCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsApi.gradeDistribution(),
      analyticsApi.gpaTrend(),
      analyticsApi.passFail(),
      studentsApi.list(),
      coursesApi.list(),
    ]).then(([gd, gpa, pf, students, courses]) => {
      setGradeDist(gd)
      setGpaTrend(gpa)
      setPassFail(pf)
      setStudentCount(students.length)
      setCourseCount(courses.length)
    }).finally(() => setLoading(false))
  }, [])

  const totalGrades = gradeDist.reduce((s, d) => s + d.count, 0)
  const passGrades = passFail.reduce((s, d) => s + d.pass, 0)
  const failGrades = passFail.reduce((s, d) => s + d.fail, 0)
  const passRate = totalGrades > 0 ? Math.round(passGrades / (passGrades + failGrades) * 100) : 0
  const latestGpa = gpaTrend.length ? gpaTrend[gpaTrend.length - 1].avg_marks : 0

  if (loading) return <div className="text-gray-500">Loading dashboard…</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview Dashboard</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Students" value={studentCount} color="blue" />
        <KpiCard label="Total Courses" value={courseCount} color="purple" />
        <KpiCard label="Pass Rate" value={`${passRate}%`} sub="marks ≥ 40" color="green" />
        <KpiCard label="Latest Avg GPA" value={latestGpa.toFixed(1)} sub="out of 100" color="amber" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Grade Distribution</h3>
          <GradeDistributionChart data={gradeDist} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">GPA Trend by Semester</h3>
          <GpaTrendChart data={gpaTrend} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Pass / Fail Ratio</h3>
          <PassFailChart data={passFail} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Pass / Fail by Course</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Course</th>
                  <th className="pb-2 text-green-600">Pass</th>
                  <th className="pb-2 text-red-500">Fail</th>
                </tr>
              </thead>
              <tbody>
                {passFail.map((row) => (
                  <tr key={row.course} className="border-b last:border-0">
                    <td className="py-2">{row.course}</td>
                    <td className="py-2 text-green-700 font-medium">{row.pass}</td>
                    <td className="py-2 text-red-600 font-medium">{row.fail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
