'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, SortAsc, SortDesc, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCheckbox from '@/components/ui/AnimatedCheckbox'
import EmptyState from '@/components/ui/EmptyState'
import GlassInput from '@/components/ui/GlassInput'
import GradientButton from '@/components/ui/GradientButton'
import Modal from '@/components/ui/Modal'
import GlassInput from '@/components/ui/GlassInput'
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

type FilterTab = 'all' | 'active' | 'completed'
type SortOption = 'newest' | 'oldest' | 'a-z' | 'completed'

export default function TasksPage() {
  const { user, token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')
  const [sort, setSort] = useState<SortOption>('newest')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  useEffect(() => {
    if (token && user) loadTasks()
  }, [token, user])

  const loadTasks = async () => {
    if (!user) return
    try {
      const sortMap: Record<SortOption, { field: string; order: string }> = {
        newest: { field: 'created_at', order: 'desc' },
        oldest: { field: 'created_at', order: 'asc' },
        'a-z': { field: 'title', order: 'asc' },
        completed: { field: 'is_completed', order: 'desc' },
      }
      const s = sortMap[sort]
      const data = await TaskService.getUserTasks(user.id, {
        search: search || undefined,
        completed: filter === 'all' ? undefined : filter === 'completed',
        sort_by: s.field as any,
        sort_order: s.order as any,
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
  }, [search, filter, sort])

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

  const saveEdit = async () => {
    if (!editingTask || !user || !editTitle.trim()) return
    try {
      await TaskService.updateTask(user.id, editingTask.id, {
        title: editTitle.trim(),
        description: editDesc.trim() || undefined,
        completed: editingTask.completed,
      })
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, title: editTitle.trim(), description: editDesc.trim() || null } : t
        )
      )
      setEditingTask(null)
      toast.success('Task updated')
    } catch {
      toast.error('Failed to update task')
    }
  }

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Tasks ({tasks.length})</h1>
        </div>

        {/* Search + Filters */}
        <GlassCard className="!p-4">
          <GlassInput
            placeholder="Search tasks... (Ctrl+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Filter Tabs */}
            <div className="flex gap-1 bg-bg-tertiary rounded-lg p-1">
              {([['all', `All ${tasks.length}`], ['active', `Active ${activeCount}`], ['completed', `Completed ${completedCount}`]] as [FilterTab, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-accent-purple/20 text-accent-purple'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="glass-input !py-1.5 !px-3 !text-sm flex items-center gap-2 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </GlassCard>

        {/* Task List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 skeleton rounded-md" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <GlassCard>
            <EmptyState
              icon="📋"
              title={search ? 'No tasks found' : 'No tasks yet'}
              description={
                search
                  ? `No tasks match "${search}"`
                  : 'Create your first task to get started!'
              }
            />
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="!p-4 !mb-0" hover={false}>
                  <div className="flex items-start gap-3">
                    <AnimatedCheckbox checked={task.completed} onChange={() => toggleTask(task)} />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? 'line-through text-text-muted'
                            : 'text-text-primary'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-text-muted">
                          {new Date(task.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            task.completed
                              ? 'bg-accent-emerald/10 text-accent-emerald'
                              : 'bg-accent-amber/10 text-accent-amber'
                          }`}
                        >
                          {task.completed ? 'Completed' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingTask(task)
                          setEditTitle(task.title)
                          setEditDesc(task.description || '')
                        }}
                        className="p-1.5 rounded text-text-muted hover:text-accent-cyan transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded text-text-muted hover:text-accent-rose transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <Modal isOpen onClose={() => setEditingTask(null)} title="Edit Task">
          <div className="space-y-4">
            <GlassInput
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <GlassInput
              label="Description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <div className="flex gap-3">
              <GradientButton onClick={saveEdit}>Save Changes</GradientButton>
              <button className="btn-secondary" onClick={() => setEditingTask(null)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
