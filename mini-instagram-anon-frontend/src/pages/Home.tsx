import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PostCard from '@/components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [kind, setKind] = useState<'all'|'text'>('all')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File|null>(null)
  const [kindCreate, setKindCreate] = useState<'text'|'image'|'voice'>('text')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  async function load() {
    const query = kind === 'text' ? '?kind=text' : ''
    const { data } = await api.get('/posts' + query)
    setPosts(data)
  }
  useEffect(() => { load() }, [kind])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const form = new FormData()
      form.append('kind', kindCreate)
      if (text) form.append('text', text)
      if (file) form.append('media', file)
      const { data } = await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' }})
      setText(''); setFile(null); setKindCreate('text')
      setPosts(prev => [data, ...prev])
    } catch (err:any) {
      setError(err?.response?.data?.error || 'Failed to post')
    } finally { setLoading(false) }
  }

  return (
    <div className="px-4">
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={()=>setKind('all')} className={`px-3 py-1 rounded-full text-sm ${kind==='all'?'bg-pastel-blue':'bg-gray-100'}`}>All</button>
          <button onClick={()=>setKind('text')} className={`px-3 py-1 rounded-full text-sm ${kind==='text'?'bg-pastel-blue':'bg-gray-100'}`}>Diaries Only</button>
        </div>
        <form onSubmit={submit} className="grid gap-2">
          <select className="card px-3 py-2" value={kindCreate} onChange={e=>setKindCreate(e.target.value as any)}>
            <option value="text">Diary (text)</option>
            <option value="image">Image</option>
            <option value="voice">Voice</option>
          </select>
          <textarea className="card px-3 py-2" rows={3} placeholder="Share your diary, thoughts, or caption (optional)" value={text} onChange={e=>setText(e.target.value)} />
          <input className="card px-3 py-2" type="file" accept={kindCreate==='image' ? 'image/*' : kindCreate==='voice' ? 'audio/*' : undefined} onChange={e=>setFile(e.target.files?.[0] || null)} />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading?'Posting...':'Post'}</button>
          <div className="text-xs text-gray-500">Images with humans are not allowed for privacy.</div>
        </form>
      </div>
      <div>
        {posts.map(p => <PostCard key={p._id} post={p} />)}
      </div>
    </div>
  )
}
