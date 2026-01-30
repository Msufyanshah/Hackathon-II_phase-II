import React, { useState } from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import { Card, Button, Modal } from '.';
import TaskForm from '../forms/TaskForm';
import apiClient from '../../lib/ApiClient';

export interface TaskItemProps extends BaseComponentProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);

  const handleToggleCompletion = async () => {
    if (!task.user_id) return;

    setIsTogglingCompletion(true);
    try {
      const response = await apiClient.toggleTaskCompletion(task.user_id, task.id, !task.completed);
      onTaskUpdate(response.data.data);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    } finally {
      setIsTogglingCompletion(false);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleDeleteTask = async () => {
    try {
      await apiClient.deleteTask(task.user_id, task.id);
      onTaskDelete(task.id);
      setIsConfirmingDelete(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Card className={`${className} ${task.completed ? 'bg-green-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={handleToggleCompletion}
            disabled={isTogglingCompletion}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300'
            } flex items-center justify-center`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                {task.description}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-400">
              <div>Created: {new Date(task.created_at).toLocaleString()}</div>
              <div>Updated: {new Date(task.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isTogglingCompletion}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isTogglingCompletion}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          task={task}
          userId={task.user_id}
          onSuccess={handleUpdateTask}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        title="Confirm Deletion"
        size="md"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete the task "{task.title}"?</p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="danger"
              onClick={handleDeleteTask}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default TaskItem;