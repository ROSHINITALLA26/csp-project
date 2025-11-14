import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export const api = axios.create({ baseURL: BASE })

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

const t = localStorage.getItem('token')
if (t) setAuthToken(t)
