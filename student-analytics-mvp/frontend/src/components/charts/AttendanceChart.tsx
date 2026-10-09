import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { AttendanceSummaryItem } from '../../types'

interface Props {
  data: AttendanceSummaryItem[]
}

export default function AttendanceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(300, data.length * 28)}>
      <BarChart layout="vertical" data={data} margin={{ left: 20, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} unit="%" />
        <YAxis
          type="category"
          dataKey="student_name"
          width={110}
          tick={{ fontSize: 11 }}
        />
        <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
        <ReferenceLine x={75} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '75%', position: 'top', fontSize: 11 }} />
        <Bar dataKey="attendance_pct" name="Attendance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
