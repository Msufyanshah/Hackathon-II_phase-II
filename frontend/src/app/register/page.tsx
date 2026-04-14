'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Github, Check } from 'lucide-react'
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

  const getStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['', '#f43f5e', '#f59e0b', '#06b6d4', '#10b981']
    return { score, label: labels[score], color: colors[score] }
  }

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
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
    <div className="min-h-screen flex bg-bg-primary overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/10" />
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg border-2 border-accent-cyan flex items-center justify-center">
              <Check className="w-5 h-5 text-accent-cyan" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-transparent">TaskFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">Join TaskFlow today</h1>
          <p className="text-text-secondary">Start organizing your tasks with our premium experience.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Create your account</h2>
            <p className="text-text-secondary">Start your free journey with us</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <GlassInput label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <GlassInput label="Username" type="text" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} icon={<User className="w-4 h-4" />} required />
            
            <div className="relative">
              <GlassInput label="Password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} required />
              <button type="button" className="absolute right-3 top-9 text-text-muted hover:text-text-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= strength.score ? strength.color : 'var(--glass-border)' }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}

            <GradientButton fullWidth disabled={isLoading} type="submit">
              Create Account
            </GradientButton>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-glass-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-bg-primary px-3 text-text-muted">OR CONTINUE WITH</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="btn-secondary flex items-center justify-center gap-2">
                <span className="text-sm">G</span> Google
              </button>
              <button type="button" className="btn-secondary flex items-center justify-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account? <Link href="/login" className="text-accent-violet hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
