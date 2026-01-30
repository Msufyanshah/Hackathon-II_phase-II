'use client';

import React from 'react';
import { Task } from '../../lib/types';
import { TaskItem, TaskFilter } from '.';

interface TaskListProps {
  tasks: Task[];
  userId: string;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  userId,
  onTaskUpdated,
  onTaskDeleted
}) => {
  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <TaskFilter filter={filter} onFilterChange={setFilter} />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter === 'completed'
            ? 'No completed tasks yet.'
            : filter === 'active'
              ? 'No active tasks. Great job!'
              : 'No tasks yet. Create your first task!'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              userId={userId}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};