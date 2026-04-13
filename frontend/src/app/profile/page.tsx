'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '@/components/ui/GlassCard'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/contexts/BetterAuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const [username, setUsername] = useState(user?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: JSON.stringify({ username }),
      })
      if (res.ok) {
        toast.success('Profile updated')
      } else {
        toast.error('Failed to update profile')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Fill in both password fields')
      return
    }
    setChangingPassword(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/auth/password/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })
      if (res.ok) {
        toast.success('Password changed')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        const data = await res.json()
        toast.error(data?.detail || 'Failed to change password')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setChangingPassword(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>

        {/* User Info */}
        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.username || user.email} size={64} />
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{user.username}</h2>
              <p className="text-sm text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <GlassInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <GlassInput
              label="Email"
              value={user.email}
              disabled
              icon={<Mail className="w-4 h-4" />}
              className="opacity-60 cursor-not-allowed"
            />
            <GradientButton onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </GradientButton>
          </div>
        </GlassCard>

        {/* Change Password */}
        <GlassCard>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent-purple" />
            Change Password
          </h2>
          <div className="space-y-4">
            <GlassInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />
            <GlassInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />
            <GradientButton onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? 'Changing...' : 'Change Password'}
            </GradientButton>
          </div>
        </GlassCard>

        {/* Account Info */}
        <GlassCard>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Account Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">User ID</span>
              <span className="text-text-muted font-mono text-xs">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Member since</span>
              <span className="text-text-muted">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Status</span>
              <span className="text-accent-emerald">Active</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
