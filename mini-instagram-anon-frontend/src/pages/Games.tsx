import React from 'react'

export default function Games() {
  return (
    <div className="px-4">
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-1">Relaxing Games</h2>
        <p className="text-sm text-gray-600 mb-4">No win/lose — just breathe and play.</p>
        <div className="grid gap-3">
          <div className="card p-4">
            <div className="font-semibold">Solo: Breathe & Tap</div>
            <div className="text-sm text-gray-600">Tap in rhythm with the pulsing circle (coming soon).</div>
          </div>
          <div className="card p-4">
            <div className="font-semibold">Multiplayer: Calm Chain</div>
            <div className="text-sm text-gray-600">Co-create patterns with friends (coming soon).</div>
          </div>
        </div>
      </div>
    </div>
  )
}
