import React, { useState } from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import Modal from './Modal';
import TaskForm from '../forms/TaskForm';
import Button from './Button';
import { Text, Heading } from './Typography';
import apiClient from '../../lib/ApiClient';

export interface TaskDetailModalProps extends BaseComponentProps {
  task: Task;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  userId,
  isOpen,
  onClose,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleTaskUpdate = (updatedTask: Task) => {
    onTaskUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleTaskDelete = async () => {
    try {
      await apiClient.deleteTask(userId, task.id);
      onTaskDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      {isEditing ? (
        <TaskForm
          task={task}
          userId={userId}
          onSuccess={handleTaskUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
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
      )}
    </Modal>
  );
};

export default TaskDetailModal;