import React, { useState } from 'react';
import { Task } from '../../lib/types';
import { TaskService } from '../../services/tasks';
import { Button, ErrorMessage } from '.';
import { BaseComponentProps } from '../../lib/types';

interface TaskCompletionToggleProps extends BaseComponentProps {
  task: Task;
  userId: string;
  onToggle?: (updatedTask: Task) => void;
  onError?: (error: Error) => void;
}

const TaskCompletionToggle: React.FC<TaskCompletionToggleProps> = ({
  task,
  userId,
  onToggle,
  onError,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Calling PATCH /users/{userId}/tasks/{taskId} to toggle completion state via request body as defined in openapi.yaml
      const updatedTask = await TaskService.toggleTaskCompletion(userId, task.id, !task.completed);

      // Call the onToggle callback with the updated task
      if (onToggle) {
        onToggle(updatedTask);
      }
    } catch (err: any) {
      console.error('Error toggling task completion:', err);

      // Handle API errors
      let errorMessage = 'Failed to update task completion status.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Call error callback if provided
      if (onError) {
        onError(new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant={task.completed ? 'secondary' : 'primary'}
        onClick={handleToggle}
        disabled={isLoading}
        className="flex items-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </>
        ) : task.completed ? (
          <>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Mark Incomplete
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Mark Complete
          </>
        )}
      </Button>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default TaskCompletionToggle;