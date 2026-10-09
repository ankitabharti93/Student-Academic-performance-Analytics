import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { SubjectAvgItem } from '../../types'

interface Props {
  data: SubjectAvgItem[]
}

export default function SubjectAveragesChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 48)}>
      <BarChart layout="vertical" data={data} margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey="subject" width={120} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: number) => v.toFixed(1)} />
        <Bar dataKey="avg_marks" name="Avg Marks" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={`hsl(${210 + i * 30}, 70%, 55%)`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
