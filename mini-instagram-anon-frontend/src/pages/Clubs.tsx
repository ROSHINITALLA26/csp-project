import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function Clubs() {
  const [clubs, setClubs] = useState<any[]>([])
  const [joining, setJoining] = useState<string|null>(null)

  async function load() {
    const { data } = await api.get('/clubs')
    setClubs(data)
  }
  useEffect(() => { load() }, [])

  async function join(id:string) {
    setJoining(id)
    try {
      await api.post(`/clubs/${id}/join`)
      alert('Joined!')
    } finally { setJoining(null) }
  }

  return (
    <div className="px-4">
      <div className="card p-4 mb-4">
        <h2 className="text-lg font-semibold">Anonymous Clubs</h2>
        <p className="text-sm text-gray-600">Find your vibe and connect safely.</p>
      </div>
      <div className="grid gap-3">
        {clubs.map(c => (
          <div key={c._id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-600">{c.description}</div>
            </div>
            <button className="btn btn-primary" onClick={()=>join(c._id)} disabled={joining===c._id}>
              {joining===c._id?'Joining...':'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
