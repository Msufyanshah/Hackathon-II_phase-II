'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import { useAuth } from '@/contexts/BetterAuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  // Password strength
  const getStrength = (pass: string): { score: number; label: string; color: string } => {
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--accent-rose)' }
    if (score === 2) return { score: 2, label: 'Fair', color: 'var(--accent-amber)' }
    if (score === 3) return { score: 3, label: 'Good', color: 'var(--accent-cyan)' }
    return { score: 4, label: 'Strong', color: 'var(--accent-emerald)' }
  }

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setIsLoading(true)

    try {
      await register(email, password, username)
      toast.success('Account created! Welcome aboard.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full opacity-20 blur-3xl"
        style={{ background: 'var(--accent-cyan)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, -25, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl"
        style={{ background: 'var(--accent-purple)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
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
          <p className="text-text-secondary">Create your account to get started</p>
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

          <GlassInput
            label="Username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <div className="relative">
            <GlassInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      background: i <= strength.score ? strength.color : 'var(--border-glass)',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}

          <GradientButton fullWidth disabled={isLoading} type="submit">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-accent-purple hover:text-accent-purple-hover font-medium transition-colors"
          >
            Sign in →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
