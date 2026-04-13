'use client'

import { motion } from 'framer-motion'

interface AnimatedCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function AnimatedCheckbox({
  checked,
  onChange,
  className = '',
}: AnimatedCheckboxProps) {
  return (
    <motion.div
      className={`relative w-5 h-5 cursor-pointer ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        className="w-5 h-5 rounded border-2 flex items-center justify-center"
        animate={{
          backgroundColor: checked ? 'var(--accent-emerald)' : 'transparent',
          borderColor: checked ? 'var(--accent-emerald)' : 'var(--border-glass)',
        }}
        transition={{ duration: 0.2 }}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </motion.div>
    </motion.div>
  )
}
