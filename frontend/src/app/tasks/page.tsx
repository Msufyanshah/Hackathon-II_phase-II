'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../../lib/types';
import { useAuth } from '../../contexts/BetterAuthContext';
import DataLoader from '../../components/ui/DataLoader';
import TaskItem from '../../components/ui/TaskItem';
import TaskCreationSection from '../../components/ui/TaskCreationSection';
import TaskFilter from '../../components/forms/TaskFilter';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Layout from '../../components/ui/Layout';

const TaskListPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState({
    searchTerm: '',
    completedFilter: 'all' as 'all' | 'completed' | 'incomplete',
    sortBy: 'created' as 'created' | 'updated' | 'title',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // Load tasks from API
  const loadTasks = async (): Promise<Task[]> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`/api/users/${user.id}/tasks`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load tasks');
    }
  };

  // Apply filters to tasks
  const applyFilters = (tasksToFilter: Task[]) => {
    let result = [...tasksToFilter];

    // Apply search filter
    if (filterParams.searchTerm) {
      const term = filterParams.searchTerm.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Apply completion filter
    if (filterParams.completedFilter !== 'all') {
      result = result.filter(task =>
        filterParams.completedFilter === 'completed' ? task.completed : !task.completed
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filterParams.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
      }

      return filterParams.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  };

  // Refresh tasks when filters change
  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = applyFilters(tasks);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [filterParams, tasks]);

  // Reload tasks when user changes
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          setLoading(true);
          setError(null);

          const tasksData = await loadTasks();
          setTasks(tasksData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [user]);

  // Handler for when a task is updated
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  // Handler for when a task is deleted
  const handleTaskDelete = (deletedTaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.filter(task => task.id !== deletedTaskId)
    );
  };

  // Handler for when a task is created
  const handleTaskCreate = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  // Handler for filter changes
  const handleFilterChange = (newFilters: {
    searchTerm?: string;
    completedFilter?: 'all' | 'completed' | 'incomplete';
    sortBy?: 'created' | 'updated' | 'title';
    sortOrder?: 'asc' | 'desc';
  }) => {
    setFilterParams(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Please log in to view your tasks.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Tasks">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

        <TaskCreationSection
          userId={user?.id || ''}
          onTaskCreate={handleTaskCreate}
        />

        <TaskFilter onFilterChange={handleFilterChange} />

        {(loading || authLoading) ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner label="Loading tasks..." />
          </div>
        ) : error ? (
          <ErrorMessage message={error} variant="error" />
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            </h2>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tasks found. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TaskListPage;