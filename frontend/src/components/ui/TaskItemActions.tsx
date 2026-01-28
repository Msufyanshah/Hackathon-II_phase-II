import React, { useState } from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import Button from './Button';
import Modal from './Modal';
import TaskForm from '../forms/TaskForm';

export interface TaskItemActionsProps extends BaseComponentProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
  userId: string;
}

const TaskItemActions: React.FC<TaskItemActionsProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  userId,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleDeleteTask = () => {
    onTaskDelete(task.id);
    setIsConfirmingDelete(false);
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsConfirmingDelete(true)}
      >
        Delete
      </Button>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          task={task}
          userId={userId}
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
    </div>
  );
};

export default TaskItemActions;