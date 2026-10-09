import client from './client'
import type { Course } from '../types'

export const coursesApi = {
  list: async (semester?: string): Promise<Course[]> => {
    const res = await client.get<Course[]>('/api/courses/', {
      params: semester ? { semester } : {},
    })
    return res.data
  },
}
