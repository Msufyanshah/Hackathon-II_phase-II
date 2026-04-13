'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import { useAuth } from '@/contexts/BetterAuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: 'var(--accent-purple)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl"
        style={{ background: 'var(--accent-cyan)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md mx-4 p-8 relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent mb-2">
            ✓ aitodo
          </h1>
          <p className="text-text-secondary">Welcome back — sign in to continue</p>
        </div>

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

          <div className="relative">
            <GlassInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-text-muted hover:text-text-secondary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <GradientButton fullWidth disabled={isLoading} type="submit">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-accent-purple hover:text-accent-purple-hover font-medium transition-colors"
          >
            Create one →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
