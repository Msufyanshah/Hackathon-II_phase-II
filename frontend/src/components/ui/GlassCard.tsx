'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`glass-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
