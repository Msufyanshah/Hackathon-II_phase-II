'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import GlassCard from '@/components/ui/GlassCard'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import Modal from '@/components/ui/Modal'
import CreateTaskModal from '@/components/ui/CreateTaskModal'
import AnimatedCheckbox from '@/components/ui/AnimatedCheckbox'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/contexts/BetterAuthContext'
import { TaskService } from '@/services/tasks'
import { Task } from '@/lib/types'

type FilterTab = 'all' | 'active' | 'completed'

export default function TasksPage() {
  const { user, token, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (token && user) loadTasks()
  }, [token, user])

  const loadTasks = async () => {
    if (!user) return
    try {
      const data = await TaskService.getUserTasks(user.id, {
        search: search || undefined,
        completed: filter === 'all' ? undefined : filter === 'completed',
      })
      setTasks(data)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [search, filter])

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

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar user={user ? { name: user.username || user.email, email: user.email } : null} onSignOut={logout} />
      <div className="ml-[260px] min-h-screen">
        <TopBar
          title="My Tasks"
          subtitle="Manage and organize all your tasks"
          searchPlaceholder="Search tasks..."
          onSearch={setSearch}
        />

        <main className="p-6 space-y-6">
          {/* Filters + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 bg-bg-secondary p-1 rounded-xl">
              {([
                ['all', `All ${tasks.length}`],
                ['active', `Active ${activeCount}`],
                ['completed', `Completed ${completedCount}`],
              ] as [FilterTab, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === key ? 'bg-accent-purple/20 text-accent-violet' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <GradientButton onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </GradientButton>
          </div>

          {/* Task List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-xl bg-bg-tertiary/50" />)}
            </div>
          ) : tasks.length === 0 ? (
            <GlassCard className="p-8">
              <EmptyState
                icon="📋"
                title={search ? 'No tasks found' : 'No tasks yet'}
                description={search ? `No tasks match "${search}"` : 'Create your first task to get started!'}
              />
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard className="p-4 flex items-start gap-4" hover={false}>
                    <AnimatedCheckbox checked={task.completed} onChange={() => toggleTask(task)} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="w-3 h-3" />
                          {new Date(task.created_at ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${task.completed ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-cyan/10 text-accent-cyan'}`}>
                          {task.completed ? 'Completed' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button onClick={() => toast.info('Edit coming soon')} className="p-1.5 rounded text-text-muted hover:text-accent-cyan transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded text-text-muted hover:text-accent-rose transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
      <CreateTaskModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={(title, desc) => { if (user) TaskService.createTask(user.id, { title, description: desc || undefined }).then(() => { loadTasks(); toast.success('Task created'); }) }} />
    </div>
  )
}
