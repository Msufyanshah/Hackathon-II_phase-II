'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import { useAuth } from '@/contexts/BetterAuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/auth/password-reset/request`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      })
      if (res.ok) { setSent(true); toast.success('Reset link sent! Check your email.') }
      else toast.error('Failed to send reset link')
    } catch { toast.error('Network error') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-bg-primary relative overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/10" />
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Reset your password</h1>
          <p className="text-text-secondary">Enter your email and we'll send you a reset link.</p>
        </div>
      </div>
      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"><ArrowLeft className="w-4 h-4" />Back to login</Link>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Forgot Password?</h1>
            <p className="text-text-secondary">Enter your email and we'll send you a reset link</p>
          </div>
          {sent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
              <div className="text-4xl">✉️</div>
              <p className="text-text-secondary">If an account exists for <strong className="text-text-primary">{email}</strong>, you'll receive a reset link shortly.</p>
              <Link href="/login" className="text-accent-cyan hover:underline text-sm">← Back to login</Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <GlassInput label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
              <GradientButton fullWidth disabled={isLoading} type="submit">{isLoading ? 'Sending...' : 'Send Reset Link'}</GradientButton>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
