import React from 'react'
import { Sparkles } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40">
      <div className="mx-3 mt-2 p-3 card flex items-center justify-center bg-gradient-to-r from-pastel-pink to-pastel-blue">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Echo — Anonymous Diaries</span>
        </div>
      </div>
    </div>
  )
}
