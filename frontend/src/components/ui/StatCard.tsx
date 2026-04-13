'use client'

import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  accentColor?: string
}

export default function StatCard({
  label,
  value,
  icon,
  accentColor = 'var(--accent-purple)',
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </div>
        <div>
          <motion.p
            className="stat-value"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.p>
          <p className="stat-label">{label}</p>
        </div>
      </div>
    </div>
  )
}
