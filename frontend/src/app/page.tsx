'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/BetterAuthContext'
import GradientButton from '@/components/ui/GradientButton'

const features = [
  { icon: '🎯', title: 'Organize', desc: 'Keep your tasks structured with smart filters and priorities' },
  { icon: '⚡', title: 'Accelerate', desc: 'Lightning-fast task management with keyboard shortcuts' },
  { icon: '🔒', title: 'Secure', desc: 'JWT authentication with user data isolation' },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: 'var(--accent-purple)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-56 h-56 rounded-full opacity-10 blur-3xl"
        style={{ background: 'var(--accent-cyan)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            aitodo
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-text-secondary mb-8 max-w-lg"
        >
          A premium task management experience — built for focus, designed for clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4"
        >
          {isAuthenticated ? (
            <Link href="/dashboard">
              <GradientButton>Go to Dashboard</GradientButton>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <GradientButton>Sign In</GradientButton>
              </Link>
              <Link href="/register">
                <button className="btn-secondary">Create Account</button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="glass-card text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
