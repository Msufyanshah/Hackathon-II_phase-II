import React, { useState } from 'react';
import { BaseComponentProps, CreateTaskRequest, UpdateTaskRequest, Task } from '../../lib/types';
import FormField from './FormField';
import Button from '../ui/Button';
import { validateCreateTask, validateUpdateTask } from './FormValidation';
import apiClient from '../../lib/ApiClient';

export interface TaskFormProps extends BaseComponentProps {
  task?: Task; // If provided, this is an edit form; otherwise, it's a create form
  userId: string;
  onSuccess?: (task: Task) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  userId,
  onSuccess,
  onError,
  onCancel,
  className = '',
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [completed, setCompleted] = useState(task?.completed || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!task;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Prepare form data
    const formData: CreateTaskRequest | UpdateTaskRequest = {
      title,
      description: description || undefined,
      completed: completed || undefined
    };

    // Validate form data based on whether it's create or update
    let validationResult;
    if (isEditing) {
      validationResult = validateUpdateTask(formData as UpdateTaskRequest);
    } else {
      validationResult = validateCreateTask(formData as CreateTaskRequest);
    }

    if (!validationResult.success) {
      // Convert Zod errors to our format
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        newErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(newErrors);
      setIsLoading(false);
      onError?.('Please fix the errors in the form');
      return;
    }

    try {
      let response;
      if (isEditing && task) {
        // Update existing task
        response = await apiClient.updateTask(userId, task.id, formData as UpdateTaskRequest);
      } else {
        // Create new task
        response = await apiClient.createTask(userId, formData as CreateTaskRequest);
      }

      onSuccess?.(response.data.data);
    } catch (error: any) {
      const errorMsg = error.message || (isEditing ? 'Failed to update task.' : 'Failed to create task.');
      setErrors({ general: errorMsg });
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {errors.general && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {errors.general}
        </div>
      )}

      <FormField
        label="Task Title"
        name="title"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        placeholder="Add details (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      {!isEditing && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
            Mark as completed
          </label>
        </div>
      )}

      <div className="flex space-x-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          variant={isEditing ? 'primary' : 'secondary'}
        >
          {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;