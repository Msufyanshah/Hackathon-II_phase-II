'use client'

import { motion } from 'framer-motion'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

export default function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color = 'var(--accent-purple)',
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="progress-ring">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-glass)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          className="progress-ring-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className="text-xs text-text-muted">{label}</span>
      )}
    </div>
  )
}
