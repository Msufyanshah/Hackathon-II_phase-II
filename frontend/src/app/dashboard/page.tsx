'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/BetterAuthContext';
import { TaskService } from '../../services/tasks';
import { Task } from '../../lib/types';
import { Card, Button, TaskCreationSection, TaskList, TaskStats } from '../../components/ui';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isAuthLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, isAuthLoading]);

  const loadTasks = async () => {
    if (!user?.id) return;
    setFetching(true);
    setError(null);
    try {
      const userTasks = await TaskService.getUserTasks(user.id);
      setTasks(userTasks || []);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      // Check if it's an auth error (401)
      if (err.response?.status === 401) {
        console.warn('Session expired, redirecting to login...');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login?error=session_expired';
        return;
      }
      setError("Backend unreachable. Check FastAPI.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  if (isAuthLoading) return <div className="p-20 text-center">Checking Session...</div>;

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Card className="p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold mb-4">Not Logged In</h2>
          <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-blue-600">Account: {user.email}</p>
          </div>
          <Button onClick={loadTasks} disabled={fetching}>
            {fetching ? 'Syncing...' : 'Refresh'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <TaskCreationSection
                userId={user.id}
                onTaskCreate={(t) => setTasks(prev => [t, ...prev])}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
              {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
              
              {Array.isArray(tasks) ? (
                <TaskList 
                  tasks={tasks} 
                  userId={user.id} 
                  onTaskUpdated={(u) => setTasks(prev => prev.map(t => t.id === u.id ? u : t))}
                  onTaskDeleted={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
                />
              ) : (
                <p className="text-gray-400">Initializing tasks...</p>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-slate-900 text-white border-none">
              <h2 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">
                Identity (UUID)
              </h2>
              <p className="text-[10px] font-mono break-all">{user.id}</p>
            </Card>
            
            <Card className="p-6">
              <TaskStats tasks={tasks} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}