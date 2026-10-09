import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { PassFailItem } from '../../types'

interface Props {
  data: PassFailItem[]
}

export default function PassFailChart({ data }: Props) {
  // Aggregate total pass/fail across all courses
  const total = data.reduce(
    (acc, d) => ({ pass: acc.pass + d.pass, fail: acc.fail + d.fail }),
    { pass: 0, fail: 0 }
  )
  const pieData = [
    { name: 'Pass', value: total.pass },
    { name: 'Fail', value: total.fail },
  ]
  const COLORS = ['#22c55e', '#ef4444']

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
