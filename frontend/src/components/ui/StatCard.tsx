'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accentColor: string
  trend?: { value: string; positive: boolean }
}

export default function StatCard({ label, value, icon: Icon, accentColor, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 relative overflow-hidden"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <motion.p
            className="text-3xl font-bold text-text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
        </div>
        <div
          className="p-2.5 rounded-xl"
          style={{ background: `${accentColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={trend.positive ? 'text-accent-emerald' : 'text-accent-rose'}>
            {trend.positive ? '↗' : '↘'} {trend.value}
          </span>
          <span className="text-xs text-text-muted">{trend.positive ? 'this week' : 'this week'}</span>
        </div>
      )}
    </motion.div>
  )
}
