'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/BetterAuthContext';
import { TaskService } from '../../services/tasks';
import { Task } from '../../lib/types';
import { Card, Button, TaskCreationSection, TaskList, TaskStats } from '../../components/ui';
import ProtectedRoute from '../../components/ui/ProtectedRoute';

// Use 'export default' directly on the function to avoid Next.js export errors
export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    // 1. HARDCODED VALID ID FROM YOUR SWAGGER LOG
    const validDbId = "c6af33a2-6a1c-433c-8496-47c6f6112b0c";

    setLoading(true);
    setError(null);

    try {
      console.log("Testing API connection with Valid UUID:", validDbId);
      
      // 2. Fetch tasks for the correct ID
      const userTasks = await TaskService.getUserTasks(validDbId);
      
      console.log("SUCCESS! Tasks from DB:", userTasks);
      setTasks(userTasks);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      // This will show if it's 401 (Auth) or 404 (Path)
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-run loadTasks whenever the user object changes (login/logout)
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (!user) {
    return null; // ProtectedRoute handles redirection to /login
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.username || 'User'}!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <TaskCreationSection
                  userId={user.id}
                  onTaskCreated={handleTaskCreated}
                />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">
                    <p>{error}</p>
                    <Button onClick={loadTasks} variant="secondary" className="mt-2">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    userId={user.id}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Username:</span> {user.username}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                </div>
              </Card>

              <Card className="p-6">
                <TaskStats tasks={tasks} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}