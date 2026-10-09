import client from './client'
import type { Student, StudentPerformance } from '../types'

export const studentsApi = {
  list: async (department?: string): Promise<Student[]> => {
    const res = await client.get<Student[]>('/api/students/', {
      params: department ? { department } : {},
    })
    return res.data
  },

  me: async (): Promise<StudentPerformance> => {
    const res = await client.get<StudentPerformance>('/api/students/me')
    return res.data
  },

  performance: async (id: number): Promise<StudentPerformance> => {
    const res = await client.get<StudentPerformance>(`/api/students/${id}/performance`)
    return res.data
  },
}
