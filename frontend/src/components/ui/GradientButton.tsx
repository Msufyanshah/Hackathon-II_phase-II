'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export default function GradientButton({
  children,
  className = '',
  fullWidth = false,
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`btn-gradient ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
