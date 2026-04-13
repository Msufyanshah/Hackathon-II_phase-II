'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, ListTodo, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '@/components/ui/GlassCard'
import StatCard from '@/components/ui/StatCard'
import ProgressRing from '@/components/ui/ProgressRing'
import AnimatedCheckbox from '@/components/ui/AnimatedCheckbox'
import Avatar from '@/components/ui/Avatar'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import { useAuth } from '@/contexts/BetterAuthContext'
import { TaskService } from '@/services/tasks'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [showDesc, setShowDesc] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (token && user) loadTasks()
  }, [token, user])

  const loadTasks = async () => {
    if (!user) return
    try {
      const data = await TaskService.getUserTasks(user.id)
      setTasks(data)
    } catch (error: any) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!newTitle.trim() || !user) return
    setCreating(true)
    try {
      const task = await TaskService.createTask(user.id, {
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
      })
      setTasks((prev) => [task, ...prev])
      setNewTitle('')
      setNewDesc('')
      setShowDesc(false)
      toast.success('Task created!')
    } catch {
      toast.error('Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const toggleTask = async (task: Task) => {
    if (!user) return
    try {
      await TaskService.toggleTaskCompletion(user.id, task.id, !task.completed)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      )
    } catch {
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!user) return
    try {
      await TaskService.deleteTask(user.id, taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const activeTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
              {user ? `, ${user.username}` : ''} 👋
            </h1>
            <p className="text-text-secondary text-sm mt-1">Here's your task overview</p>
          </div>
          {user && <Avatar name={user.username || user.email} size={40} />}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Tasks"
            value={totalTasks}
            icon={<ListTodo className="w-5 h-5" />}
            accentColor="var(--accent-purple)"
          />
          <StatCard
            label="Active"
            value={activeTasks}
            icon={<Circle className="w-5 h-5" />}
            accentColor="var(--accent-amber)"
          />
          <StatCard
            label="Completed"
            value={completedTasks}
            icon={<CheckCircle className="w-5 h-5" />}
            accentColor="var(--accent-emerald)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Task Creation */}
            <GlassCard>
              <GlassInput
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createTask()}
                icon={<Plus className="w-4 h-4" />}
              />
              {showDesc && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <GlassInput
                    className="mt-3"
                    placeholder="Description (optional)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </motion.div>
              )}
              <div className="flex gap-2 mt-3">
                <GradientButton onClick={createTask} disabled={creating || !newTitle.trim()}>
                  {creating ? 'Adding...' : 'Add Task'}
                </GradientButton>
                <button className="btn-secondary text-sm" onClick={() => setShowDesc(!showDesc)}>
                  {showDesc ? 'Hide' : '+ Description'}
                </button>
              </div>
            </GlassCard>

            {/* Recent Tasks */}
            <GlassCard>
              <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Tasks</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 skeleton rounded-md" />
                  ))}
                </div>
              ) : recentTasks.length === 0 ? (
                <p className="text-text-secondary text-center py-8">
                  No tasks yet — create your first one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-glass transition-colors group"
                    >
                      <AnimatedCheckbox
                        checked={task.completed}
                        onChange={() => toggleTask(task)}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            task.completed
                              ? 'line-through text-text-muted'
                              : 'text-text-primary'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-text-muted truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-text-muted">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-text-muted hover:text-accent-rose transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Ring */}
            <GlassCard className="flex flex-col items-center justify-center py-8">
              <ProgressRing progress={completionRate} size={120} strokeWidth={8} label={`${completionRate}% complete`} />
            </GlassCard>

            {/* User Info */}
            {user && (
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={user.username || user.email} size={44} />
                  <div>
                    <p className="font-medium text-text-primary">{user.username || 'User'}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
