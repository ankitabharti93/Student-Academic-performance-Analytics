import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { GpaPoint } from '../../types'

interface Props {
  data: GpaPoint[]
}

export default function GpaTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="semester" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(v: number) => v.toFixed(1)} />
        <Line
          type="monotone"
          dataKey="avg_marks"
          name="Avg Marks"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
