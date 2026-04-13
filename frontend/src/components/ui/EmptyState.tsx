'use client'

import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-bg-glass border border-border-glass flex items-center justify-center mb-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-3xl text-text-muted">{icon}</span>
      </motion.div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-gradient text-sm px-6 py-2"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
