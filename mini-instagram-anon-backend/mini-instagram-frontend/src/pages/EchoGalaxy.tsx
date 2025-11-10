import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import GalaxyCanvas from '@/components/GalaxyCanvas'

export default function EchoGalaxy() {
  const [stars, setStars] = useState<any[]>([])
  const [audio, setAudio] = useState<HTMLAudioElement|null>(null)
  const [supporting, setSupporting] = useState<string | null>(null)

  async function load() {
    const { data } = await api.get('/echo/stars')
    const list = data.stars.map((s:any, idx:number) => ({
      id: s.id, audio: s.audio, support: s.support,
      x: (Math.sin(idx*12.9898)*43758.5453 % 1 + 1) % 1,
      y: (Math.sin(idx*78.233)*12345.6789 % 1 + 1) % 1,
      r: 2 + Math.random()*1.5
    }))
    setStars(list)
  }
  useEffect(() => { load() }, [])

  function onClickStar(s:any) {
    if (audio) { audio.pause() }
    const el = new Audio(s.audio)
    setAudio(el)
    el.play()
  }

  async function supportStar(id:string) {
    setSupporting(id)
    try {
      const { data } = await api.post(`/posts/${id}/support`)
      setStars(prev => prev.map(p => p.id===id ? { ...p, support: data.supportCount } : p))
    } finally { setSupporting(null) }
  }

  return (
    <div className="px-4">
      <div className="card p-4 mb-3">
        <h2 className="text-lg font-semibold">Echo Galaxy</h2>
        <p className="text-sm text-gray-600">Tap a star to listen. Send support to make it shine brighter ✨</p>
      </div>
      <GalaxyCanvas stars={stars} onClickStar={onClickStar} />
      <div className="card p-4 mt-3">
        <div className="text-sm text-gray-600 mb-2">Stars: {stars.length}</div>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto">
          {stars.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-white rounded-xl p-2 border">
              <div className="text-sm">Voice • Support: {s.support}</div>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={()=>onClickStar(s)}>Play</button>
                <button className="btn btn-primary" onClick={()=>supportStar(s.id)} disabled={supporting===s.id}>
                  {supporting===s.id?'Sending...':'Send Support'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
