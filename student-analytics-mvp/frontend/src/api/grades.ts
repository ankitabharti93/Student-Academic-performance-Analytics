import client from './client'
import type { Grade } from '../types'

interface GradeCreate {
  enrollment_id: number
  marks: number
  assessment_type: string
  semester: string
}

export const gradesApi = {
  create: async (data: GradeCreate): Promise<Grade> => {
    const res = await client.post<Grade>('/api/grades/', data)
    return res.data
  },

  list: async (params?: { course_id?: number; student_id?: number; semester?: string }): Promise<Grade[]> => {
    const res = await client.get<Grade[]>('/api/grades/', { params })
    return res.data
  },
}
