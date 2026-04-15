'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import GlassCard from '@/components/ui/GlassCard'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/contexts/BetterAuthContext'

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState(user?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login')
  }, [isLoading, isAuthenticated, router])

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt_token')}` },
        body: JSON.stringify({ username }),
      })
      if (res.ok) toast.success('Profile updated')
      else toast.error('Failed to update profile')
    } catch { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) { toast.error('Fill in both password fields'); return }
    if (newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return }
    setChangingPassword(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const token = localStorage.getItem('jwt_token')
      const res = await fetch(`${API_BASE}/api/auth/password/change`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      })
      const data = await res.json()
      if (res.ok) { toast.success('Password changed successfully'); setCurrentPassword(''); setNewPassword('') }
      else toast.error(data?.detail || 'Failed to change password')
    } catch { toast.error('Network error') }
    finally { setChangingPassword(false) }
  }

  const handleSignOut = () => {
    logout()
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    router.push('/login')
    toast.success('Signed out')
  }

  if (isLoading || !isAuthenticated || !user) return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-secondary">Loading...</div>

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar user={{ name: user.username || user.email, email: user.email }} onSignOut={handleSignOut} />
      <div className="ml-[260px] min-h-screen">
        <TopBar title="Profile" subtitle="Manage your account settings" />
        <main className="p-6 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={user.username || user.email} size={64} />
              <div><h2 className="text-lg font-semibold text-text-primary">{user.username}</h2><p className="text-sm text-text-muted">{user.email}</p></div>
            </div>
            <div className="space-y-4">
              <GlassInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} icon={<User className="w-4 h-4 text-accent-cyan" />} />
              <GlassInput label="Email" value={user.email} disabled icon={<Mail className="w-4 h-4 text-accent-cyan" />} className="opacity-60 cursor-not-allowed" />
              <GradientButton onClick={handleSaveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</GradientButton>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-accent-cyan" />Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Current Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-cyan pointer-events-none"><Lock className="w-4 h-4" /></div>
                  <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="glass-input pl-10 pr-10" placeholder="Enter current password" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-cyan pointer-events-none"><Lock className="w-4 h-4" /></div>
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="glass-input pl-10 pr-10" placeholder="Enter new password (min. 8 characters)" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <GradientButton onClick={handleChangePassword} disabled={changingPassword}>{changingPassword ? 'Changing...' : 'Change Password'}</GradientButton>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Account Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">User ID</span><span className="text-text-muted font-mono text-xs">{user.id}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Member since</span><span className="text-text-muted">{new Date(user.created_at ?? '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Status</span><span className="text-accent-emerald">Active</span></div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
