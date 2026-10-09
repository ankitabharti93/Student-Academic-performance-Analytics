import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { GradeDistItem } from '../../types'

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
}

interface Props {
  data: GradeDistItem[]
}

export default function GradeDistributionChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.grade.localeCompare(b.grade))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={sorted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="grade" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" name="Students" fill="#3b82f6">
          {sorted.map((entry, i) => (
            <rect key={i} fill={GRADE_COLORS[entry.grade] ?? '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
