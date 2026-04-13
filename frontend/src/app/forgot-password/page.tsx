'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
        toast.success('Reset link sent! Check your email.')
      } else {
        toast.error('Failed to send reset link')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'var(--accent-cyan)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md mx-4 p-8 relative z-10"
      >
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Forgot Password?</h1>
          <p className="text-text-secondary">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="text-4xl">✉️</div>
            <p className="text-text-secondary">
              If an account exists for <strong className="text-text-primary">{email}</strong>,
              you'll receive a reset link shortly.
            </p>
            <Link href="/login" className="text-accent-cyan hover:underline text-sm">
              ← Back to login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <GlassInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <GradientButton fullWidth disabled={isLoading} type="submit">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </GradientButton>
          </form>
        )}
      </motion.div>
    </div>
  )
}
