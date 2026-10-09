import { useEffect, useState } from 'react'
import { analyticsApi } from '../api/analytics'
import SubjectAveragesChart from '../components/charts/SubjectAveragesChart'
import type { SubjectAvgItem } from '../types'

const SEMESTERS = ['2023-Fall', '2024-Spring']

export default function SubjectsPage() {
  const [data, setData] = useState<SubjectAvgItem[]>([])
  const [semester, setSemester] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    analyticsApi.subjectAverages(semester ? { semester } : {})
      .then(setData)
      .finally(() => setLoading(false))
  }, [semester])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject Averages</h2>

      <div className="mb-4">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Mean Marks per Subject</h3>
        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : (
          <SubjectAveragesChart data={data} />
        )}
      </div>
    </div>
  )
}
