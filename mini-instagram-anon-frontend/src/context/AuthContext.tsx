import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken } from '@/lib/api'

type User = { anonId: string; email?: string | null; createdAt?: string; lastActiveAt?: string }
type AuthCtx = {
  user: User | null,
  token: string | null,
  login: (email: string, password: string) => Promise<void>,
  register: (email?: string, password?: string) => Promise<void>,
  logout: () => void,
  refreshMe: () => Promise<void>
}

const Ctx = createContext<AuthCtx>(null as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User|null>(null)
  const [token, setToken] = useState<string|null>(localStorage.getItem('token'))

  useEffect(() => { if (token) refreshMe() }, [])

  async function refreshMe() {
    try {
      const { data } = await api.get('/profile/me')
      setUser(data)
    } catch {}
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    setAuthToken(data.token); setToken(data.token); await refreshMe()
  }

  async function register(email?: string, password?: string) {
    const { data } = await api.post('/auth/register', { email, password })
    setAuthToken(data.token); setToken(data.token); await refreshMe()
  }

  function logout() { setAuthToken(null); setToken(null); setUser(null) }

  return <Ctx.Provider value={{ user, token, login, register, logout, refreshMe }}>{children}</Ctx.Provider>
}

export function useAuth() { return useContext(Ctx) }
