import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { studentsApi } from '../api/students'
import type { Student } from '../types'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    studentsApi.list(dept || undefined)
      .then(setStudents)
      .finally(() => setLoading(false))
  }, [dept])

  const filtered = students.filter((s) =>
    s.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Students</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.user.email}</td>
                  <td className="px-4 py-3">{s.department}</td>
                  <td className="px-4 py-3">{s.program}</td>
                  <td className="px-4 py-3">Year {s.year_of_study}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/students/${s.id}`}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      View Profile →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
