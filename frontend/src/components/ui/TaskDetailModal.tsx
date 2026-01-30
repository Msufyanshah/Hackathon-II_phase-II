import React, { useEffect, useState } from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import { TaskService } from '../../services/tasks';
import { Modal, Button, ErrorMessage } from '.';
import { Text, Heading } from './Typography';
import TaskForm from '../forms/TaskForm';

interface TaskDetailModalProps extends BaseComponentProps {
  taskId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  userId,
  isOpen,
  onClose,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      loadTaskDetails();
    }
  }, [isOpen, taskId]);

  const loadTaskDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch task via GET /users/{userId}/tasks/{taskId} - displaying task details per Task schema in openapi.yaml
      const fetchedTask = await TaskService.getTaskById(taskId);
      setTask(fetchedTask);
    } catch (err: any) {
      console.error('Error fetching task details:', err);

      // Handle API errors
      let errorMessage = 'Failed to load task details.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    onTaskUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleTaskDelete = async () => {
    if (!task) return;

    try {
      await TaskService.deleteTask(task.id);
      onTaskDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      {isEditing && task ? (
        <TaskForm
          task={task}
          userId={userId}
          onSuccess={handleTaskUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-6">
          <ErrorMessage message={error} />
          <div className="flex justify-end pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      ) : task ? (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <Heading level={2} className="text-xl font-bold">
              {task.title}
            </Heading>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>

          {task.description && (
            <div>
              <Text variant="secondary" className="font-medium">Description:</Text>
              <Text>{task.description}</Text>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Text variant="secondary" className="font-medium">Status:</Text>
              <Text>{task.completed ? 'Completed' : 'Incomplete'}</Text>
            </div>
            <div>
              <Text variant="secondary" className="font-medium">Created:</Text>
              <Text>{new Date(task.created_at).toLocaleString()}</Text>
            </div>
            <div>
              <Text variant="secondary" className="font-medium">Updated:</Text>
              <Text>{new Date(task.updated_at).toLocaleString()}</Text>
            </div>
            <div>
              <Text variant="secondary" className="font-medium">ID:</Text>
              <Text className="text-xs break-all">{task.id}</Text>
            </div>
          </div>

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
                  onClick={handleTaskDelete}
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
        </div>
      ) : (
        <div className="p-6">
          <p className="text-gray-500">Task not found</p>
          <div className="flex justify-end pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;