import client from './client'
import type {
  GpaPoint,
  GradeDistItem,
  PassFailItem,
  SubjectAvgItem,
  AttendanceSummaryItem,
} from '../types'

export const analyticsApi = {
  gradeDistribution: async (params?: { semester?: string; course_id?: number }): Promise<GradeDistItem[]> => {
    const res = await client.get<GradeDistItem[]>('/api/analytics/grade-distribution', { params })
    return res.data
  },

  gpaTrend: async (params?: { department?: string }): Promise<GpaPoint[]> => {
    const res = await client.get<GpaPoint[]>('/api/analytics/gpa-trend', { params })
    return res.data
  },

  passFail: async (params?: { semester?: string }): Promise<PassFailItem[]> => {
    const res = await client.get<PassFailItem[]>('/api/analytics/pass-fail', { params })
    return res.data
  },

  subjectAverages: async (params?: { semester?: string }): Promise<SubjectAvgItem[]> => {
    const res = await client.get<SubjectAvgItem[]>('/api/analytics/subject-averages', { params })
    return res.data
  },

  attendanceSummary: async (params?: { course_id?: number; department?: string }): Promise<AttendanceSummaryItem[]> => {
    const res = await client.get<AttendanceSummaryItem[]>('/api/analytics/attendance-summary', { params })
    return res.data
  },
}
