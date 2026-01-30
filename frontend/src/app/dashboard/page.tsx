'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TaskService } from '../../services/tasks';
import { Task } from '../../lib/types';
import { Card, Button, TaskCreationSection, TaskList, TaskStats } from '../../components/ui';
import ProtectedRoute from '../../components/ui/ProtectedRoute';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userTasks = await TaskService.getUserTasks(user.id);
      setTasks(userTasks);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

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
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.username}!</p>
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
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
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
                  <p><span className="font-medium">Name:</span> {user.username}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                </div>
              </Card>

              <Card className="p-6">
                <TaskStats tasks={tasks} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full">
                    View All Tasks
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Settings
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;