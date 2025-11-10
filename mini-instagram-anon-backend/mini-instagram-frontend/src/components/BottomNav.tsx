import React from 'react'
import { Home, Music4, Users, Gamepad2, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/echo', icon: Music4, label: 'Echo' },
  { to: '/clubs', icon: Users, label: 'Clubs' },
  { to: '/games', icon: Gamepad2, label: 'Games' },
  { to: '/profile', icon: UserRound, label: 'Account' },
]

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40">
      <div className="mx-3 mb-2 p-2 card flex items-center justify-between">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({isActive}) => `flex-1 text-center py-2 rounded-xl transition ${isActive ? 'bg-pastel-blue font-semibold' : 'hover:bg-gray-50'}`}>
            <div className="flex flex-col items-center gap-1">
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
