import client from './client'
import type { Token, User } from '../types'

export const authApi = {
  login: async (email: string, password: string): Promise<Token> => {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)
    const res = await client.post<Token>('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return res.data
  },

  me: async (): Promise<User> => {
    const res = await client.get<User>('/api/auth/me')
    return res.data
  },
}
