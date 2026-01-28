import React, { useState } from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import apiClient from '../../lib/ApiClient';

export interface TaskCompletionToggleProps extends BaseComponentProps {
  task: Task;
  userId: string;
  onToggle?: (updatedTask: Task) => void;
}

const TaskCompletionToggle: React.FC<TaskCompletionToggleProps> = ({
  task,
  userId,
  onToggle,
  className = '',
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(task.completed);

  const handleToggle = async () => {
    if (!userId || isToggling) return;

    setIsToggling(true);
    try {
      const response = await apiClient.toggleTaskCompletion(userId, task.id, !localCompleted);
      const updatedTask = response.data.data;

      setLocalCompleted(updatedTask.completed);
      onToggle?.(updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Revert the local state if there was an error
      setLocalCompleted(!localCompleted);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`flex-shrink-0 w-5 h-5 rounded border ${
        localCompleted
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-gray-300 hover:border-gray-400'
      } flex items-center justify-center transition-colors ${className}`}
      aria-label={localCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      title={localCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {isToggling ? (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : localCompleted ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ) : null}
    </button>
  );
};

export default TaskCompletionToggle;