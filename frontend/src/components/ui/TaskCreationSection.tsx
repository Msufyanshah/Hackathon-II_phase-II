import React, { useState } from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import { Card, Button, Modal } from '.';
import TaskForm from '../forms/TaskForm';

export interface TaskCreationSectionProps extends BaseComponentProps {
  userId: string;
  onTaskCreate: (task: Task) => void;
}

const TaskCreationSection: React.FC<TaskCreationSectionProps> = ({
  userId,
  onTaskCreate,
  className = '',
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleTaskCreate = (task: Task) => {
    onTaskCreate(task);
    setIsCreating(false);
  };

  return (
    <Card className={className}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Create New Task</h2>
        <Button onClick={() => setIsCreating(true)}>
          Add Task
        </Button>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          userId={userId}
          onSuccess={handleTaskCreate}
          onCancel={() => setIsCreating(false)}
        />
      </Modal>
    </Card>
  );
};

export default TaskCreationSection;