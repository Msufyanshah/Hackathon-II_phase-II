'use client'

import { Search, Bell } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
}

export default function TopBar({ title, subtitle, searchPlaceholder, onSearch }: TopBarProps) {
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-glass-border bg-bg-secondary/50 backdrop-blur-xl sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {onSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder || 'Search...'}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                onSearch(e.target.value)
              }}
              className="glass-input pl-10 pr-4 py-2 w-64 text-sm"
            />
          </div>
        )}
        <button className="relative p-2 rounded-xl glass text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full" />
        </button>
      </div>
    </header>
  )
}
