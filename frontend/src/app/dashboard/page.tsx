'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle2, Zap, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import StatCard from '@/components/ui/StatCard'
import ProgressRing from '@/components/ui/ProgressRing'
import GlassCard from '@/components/ui/GlassCard'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import CreateTaskModal from '@/components/ui/CreateTaskModal'
import Avatar from '@/components/ui/Avatar'
import AnimatedCheckbox from '@/components/ui/AnimatedCheckbox'
import { useAuth } from '@/contexts/BetterAuthContext'
import { TaskService } from '@/services/tasks'
import { Task } from '@/lib/types'

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (token && user) loadTasks()
  }, [token, user])

  const loadTasks = async () => {
    if (!user) return
    try {
      const data = await TaskService.getUserTasks(user.id)
      setTasks(data)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (title: string, description: string) => {
    if (!user) return
    setCreating(true)
    try {
      await TaskService.createTask(user.id, { title, description: description || undefined })
      await loadTasks()
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
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
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
  const activeTasks = tasks.filter((t) => !t.completed).length
  const completedTasks = tasks.filter((t) => t.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <Sidebar user={user ? { name: user.username || user.email, email: user.email } : null} onSignOut={logout} />

      {/* Main Content */}
      <div className="ml-[260px] min-h-screen">
        {/* Top Bar */}
        <TopBar
          title="Dashboard"
          subtitle={`Welcome back, ${user?.username || 'User'}! Here's your overview.`}
          searchPlaceholder="Search tasks..."
        />

        <main className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Tasks" value={totalTasks} icon={FileText} accentColor="#7c3aed" trend={{ value: `+${completedTasks} this week`, positive: true }} />
            <StatCard label="Active" value={activeTasks} icon={Clock} accentColor="#06b6d4" />
            <StatCard label="Completed" value={completedTasks} icon={CheckCircle2} accentColor="#10b981" trend={{ value: `+${completedTasks} today`, positive: true }} />
            <StatCard label="Day Streak" value={completedTasks > 0 ? completedTasks : 0} icon={Zap} accentColor="#f59e0b" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Quick Add + Recent Tasks */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Add */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4 text-text-secondary">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Quick Add Task</span>
                </div>
                <div className="space-y-3">
                  <GlassInput
                    placeholder="What needs to be done?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && newTitle.trim() && (createTask(newTitle, ''), setNewTitle(''))}
                  />
                  <div className="flex gap-3">
                    <GradientButton onClick={() => { if (newTitle.trim()) { createTask(newTitle, ''); setNewTitle(''); } }} disabled={creating || !newTitle.trim()}>
                      {creating ? 'Adding...' : 'Add Task'}
                    </GradientButton>
                    <button className="btn-secondary text-sm" onClick={() => setShowModal(true)}>
                      + Description
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Recent Tasks */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent-violet" />
                    Recent Tasks
                  </h2>
                  <a href="/tasks" className="text-xs text-accent-violet hover:underline">View All →</a>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-bg-tertiary/50" />)}
                  </div>
                ) : recentTasks.length === 0 ? (
                  <p className="text-center py-8 text-text-muted text-sm">No tasks yet — create your first one!</p>
                ) : (
                  <div className="space-y-2">
                    {recentTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-glass-bg transition-colors group"
                      >
                        <AnimatedCheckbox checked={task.completed} onChange={() => toggleTask(task)} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                            {task.title}
                          </p>
                          {task.description && <p className="text-xs text-text-muted truncate mt-0.5">{task.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-text-muted">{new Date(task.created_at).toLocaleDateString()}</span>
                          <button onClick={() => deleteTask(task.id)} className="text-text-muted hover:text-accent-rose text-xs">✕</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right Column: Progress + User Info */}
            <div className="space-y-6">
              <GlassCard className="p-5 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-4 text-text-secondary">
                  <Zap className="w-4 h-4 text-accent-violet" />
                  <span className="text-sm font-medium">Progress</span>
                </div>
                <ProgressRing progress={completionRate} size={130} strokeWidth={7} color="#06b6d4" />
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-purple" /> Completed ({completedTasks})</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-bg-tertiary" /> Remaining ({activeTasks})</div>
                </div>
              </GlassCard>

              {user && (
                <GlassCard className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={user.username || user.email} size={44} />
                    <div>
                      <p className="font-medium text-text-primary">{user.username}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-text-muted">
                    <div className="flex justify-between"><span>User ID</span><span className="font-mono text-text-secondary truncate ml-2">{user.id}</span></div>
                    <div className="flex justify-between"><span>Joined</span><span>{new Date(user.created_at ?? '').toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span>Status</span><span className="text-accent-emerald">Active</span></div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={createTask} />
    </div>
  )
}
