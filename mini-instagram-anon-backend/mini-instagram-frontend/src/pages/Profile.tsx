import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Profile() {
  const { user, logout, refreshMe } = useAuth()
  useEffect(() => { refreshMe() }, [])

  return (
    <div className="px-4">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-2">Your Anonymous Profile</h2>
        <div className="text-sm text-gray-600 mb-4">Your identity is hidden. Share safely.</div>
        <div className="grid gap-2">
          <div className="card p-3">Anonymous ID: <b>{user?.anonId || '...'}</b></div>
          <div className="card p-3">Created: {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '...'}</div>
          <div className="card p-3">Last Active: {user?.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : '...'}</div>
        </div>
        <button className="btn btn-outline mt-4" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
