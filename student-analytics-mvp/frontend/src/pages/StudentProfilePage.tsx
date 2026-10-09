import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { studentsApi } from '../api/students'
import GpaTrendChart from '../components/charts/GpaTrendChart'
import KpiCard from '../components/KpiCard'
import type { StudentPerformance } from '../types'

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<StudentPerformance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    studentsApi.performance(Number(id))
      .then(setData)
      .catch(() => setError('Failed to load student profile.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-gray-500">Loading…</div>
  if (error || !data) return <div className="text-red-500">{error || 'Not found.'}</div>

  const overallAvg = data.course_breakdown.length
    ? (data.course_breakdown.reduce((s, c) => s + c.avg_marks, 0) / data.course_breakdown.length).toFixed(1)
    : '—'

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{data.student.name}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {data.student.program} · {data.student.department} · Year {data.student.year_of_study}
      </p>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Overall Avg Marks" value={overallAvg} color="blue" />
        <KpiCard label="Attendance" value={`${data.attendance_pct}%`} color={data.attendance_pct >= 75 ? 'green' : 'red'} />
        <KpiCard label="Courses Enrolled" value={data.course_breakdown.length} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">GPA Trend</h3>
          <GpaTrendChart data={data.gpa_trend} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Course Breakdown</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="pb-2">Course</th>
                <th className="pb-2">Code</th>
                <th className="pb-2 text-right">Avg Marks</th>
              </tr>
            </thead>
            <tbody>
              {data.course_breakdown.map((c) => (
                <tr key={c.course_code} className="border-b last:border-0">
                  <td className="py-2">{c.course_name}</td>
                  <td className="py-2 text-gray-500">{c.course_code}</td>
                  <td className="py-2 text-right font-medium">
                    <span className={c.avg_marks >= 40 ? 'text-green-700' : 'text-red-600'}>
                      {c.avg_marks.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
