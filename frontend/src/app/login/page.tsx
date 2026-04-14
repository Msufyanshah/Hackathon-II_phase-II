'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/BetterAuthContext'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Github, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) router.push('/dashboard')
  }, [isAuthenticated, user, router])

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

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen flex bg-bg-primary overflow-hidden">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-cyan/10" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg border-2 border-accent-violet flex items-center justify-center">
              <Check className="w-5 h-5 text-accent-violet" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-transparent">TaskFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">Organize your work,<br /><span className="bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-transparent">amplify your life.</span></h1>
          <p className="text-text-secondary mb-8">A premium task management experience built for focus, speed, and clarity.</p>
          <div className="flex flex-wrap gap-3">
            {['JWT Secured', 'Real-time Sync', 'Smart Filters'].map((tag) => (
              <span key={tag} className="glass px-4 py-2 rounded-full text-xs text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple inline-block mr-2" />{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h2>
            <p className="text-text-secondary">Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <GlassInput label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"><Lock className="w-4 h-4" /></div>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input pl-10 pr-10" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" className="custom-checkbox" />Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-accent-violet hover:underline">Forgot password?</Link>
            </div>
            <GradientButton fullWidth disabled={isLoading} type="submit" className="flex items-center justify-center gap-2">Sign In →</GradientButton>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-glass-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-bg-primary px-3 text-text-muted">OR CONTINUE WITH</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="btn-secondary flex items-center justify-center gap-2"><span className="text-sm">G</span> Google</button>
              <button type="button" className="btn-secondary flex items-center justify-center gap-2"><Github className="w-4 h-4" /> GitHub</button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-text-secondary">Don't have an account? <Link href="/register" className="text-accent-violet hover:underline font-medium">Create one</Link></p>
        </motion.div>
      </div>
    </div>
  )
}
