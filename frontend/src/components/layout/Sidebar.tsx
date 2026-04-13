'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  items: NavItem[]
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ items, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass h-screen sticky top-0 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        borderRadius: 0,
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
      }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border-glass">
        {!collapsed ? (
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            ✓ aitodo
          </h1>
        ) : (
          <span className="text-xl font-bold text-accent-purple">✓</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isActive
                    ? 'text-accent-purple border-r-2 border-accent-purple bg-accent-purple/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-glass'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="p-4 border-t border-border-glass text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          {collapsed ? '→' : '◁ Collapse'}
        </button>
      )}
    </motion.aside>
  )
}
