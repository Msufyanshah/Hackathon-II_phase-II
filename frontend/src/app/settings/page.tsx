'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Shield, Globe, Eye, Lock, Trash2, LogOut, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import GlassCard from '@/components/ui/GlassCard'
import GradientButton from '@/components/ui/GradientButton'
import { useAuth } from '@/contexts/BetterAuthContext'

export default function SettingsPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login')
  }, [isLoading, isAuthenticated, router])

  const handleSignOut = () => {
    logout()
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    router.push('/login')
    toast.success('Signed out successfully')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion not implemented yet')
    }
  }

  if (isLoading || !isAuthenticated || !user) return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-secondary">Loading...</div>

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar user={{ name: user.username || user.email, email: user.email }} onSignOut={handleSignOut} />
      <div className="ml-[260px] min-h-screen">
        <TopBar title="Settings" subtitle="Manage your preferences and account" />
        <main className="p-6 space-y-6">
          {/* Appearance */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-accent-cyan" />Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-accent-violet" /> : <Sun className="w-5 h-5 text-accent-amber" />}
                  <div><p className="text-sm font-medium text-text-primary">Dark Mode</p><p className="text-xs text-text-muted">Toggle dark theme</p></div>
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-accent-purple' : 'bg-bg-tertiary'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-accent-cyan" />
                  <div><p className="text-sm font-medium text-text-primary">Language</p><p className="text-xs text-text-muted">Select your preferred language</p></div>
                </div>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="glass-input !py-1.5 !px-3 !text-sm !w-auto">
                  <option value="en">English</option>
                  <option value="ur">اردو</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </GlassCard>
          {/* Notifications */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-accent-cyan" />Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-accent-cyan" />
                  <div><p className="text-sm font-medium text-text-primary">Email Notifications</p><p className="text-xs text-text-muted">Receive task updates via email</p></div>
                </div>
                <button onClick={() => setEmailNotif(!emailNotif)} className={`w-12 h-6 rounded-full transition-colors ${emailNotif ? 'bg-accent-purple' : 'bg-bg-tertiary'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-accent-amber" />
                  <div><p className="text-sm font-medium text-text-primary">Push Notifications</p><p className="text-xs text-text-muted">Browser push notifications</p></div>
                </div>
                <button onClick={() => setPushNotif(!pushNotif)} className={`w-12 h-6 rounded-full transition-colors ${pushNotif ? 'bg-accent-purple' : 'bg-bg-tertiary'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${pushNotif ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </GlassCard>
          {/* Security */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-accent-cyan" />Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-accent-emerald" />
                  <div><p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p><p className="text-xs text-text-muted">Add extra security to your account</p></div>
                </div>
                <span className="text-xs text-text-muted">Coming soon</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan" />
                  <div><p className="text-sm font-medium text-text-primary">Active Sessions</p><p className="text-xs text-text-muted">Manage your logged-in devices</p></div>
                </div>
                <span className="text-xs text-accent-emerald">1 active</span>
              </div>
            </div>
          </GlassCard>
          {/* Danger Zone */}
          <GlassCard className="p-6 border-accent-rose/20">
            <h2 className="text-lg font-semibold text-accent-rose mb-4 flex items-center gap-2"><Trash2 className="w-5 h-5" />Danger Zone</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent-rose/5">
                <div><p className="text-sm font-medium text-text-primary">Delete Account</p><p className="text-xs text-text-muted">Permanently delete your account and all data</p></div>
                <button onClick={handleDeleteAccount} className="btn-secondary !border-accent-rose/30 !text-accent-rose hover:!bg-accent-rose/10">Delete</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent-rose/5">
                <div><p className="text-sm font-medium text-text-primary">Sign Out</p><p className="text-xs text-text-muted">Sign out from all devices</p></div>
                <button onClick={handleSignOut} className="btn-secondary !border-accent-rose/30 !text-accent-rose hover:!bg-accent-rose/10"><LogOut className="w-4 h-4 mr-2" />Sign Out</button>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
