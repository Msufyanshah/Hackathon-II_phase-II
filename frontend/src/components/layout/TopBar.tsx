'use client'

import { useState } from 'react'
import { Search, Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopBarProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
}

const notifications = [
  { id: 1, title: 'Task completed', message: 'Design homepage was marked complete', time: '2m ago', unread: true },
  { id: 2, title: 'New task assigned', message: 'API integration tests added', time: '1h ago', unread: true },
  { id: 3, title: 'Profile updated', message: 'Your profile information was saved', time: '3h ago', unread: false },
]

export default function TopBar({ title, subtitle, searchPlaceholder, onSearch }: TopBarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

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
              onChange={(e) => { setSearchValue(e.target.value); onSearch(e.target.value) }}
              className="glass-input pl-10 pr-4 py-2 w-64 text-sm"
            />
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl glass text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-rose rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 glass-card z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-glass-border">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-text-muted hover:text-text-primary">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-glass-border hover:bg-glass-bg transition-colors ${notif.unread ? 'bg-accent-purple/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-accent-purple' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary">{notif.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">{notif.message}</p>
                            <p className="text-xs text-text-muted mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-glass-border">
                    <button className="w-full text-center text-xs text-accent-violet hover:underline">View all notifications</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
