import React from 'react';
import { BaseComponentProps, Task } from '../../lib/types';
import { Card } from '.';
import { Heading, Text } from './Typography';

export interface TaskStatsProps extends BaseComponentProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({
  tasks,
  className = '',
}) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className={className}>
      <Heading level={3} className="mb-4">Task Statistics</Heading>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Text variant="primary" size="xl" className="font-bold">{totalTasks}</Text>
          <Text variant="muted" size="sm">Total Tasks</Text>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Text variant="primary" size="xl" className="font-bold">{completedTasks}</Text>
          <Text variant="muted" size="sm">Completed</Text>
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <Text variant="primary" size="xl" className="font-bold">{incompleteTasks}</Text>
          <Text variant="muted" size="sm">Pending</Text>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Text variant="primary" size="xl" className="font-bold">{completionRate}%</Text>
          <Text variant="muted" size="sm">Completion Rate</Text>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <Text variant="muted" size="sm" className="text-right mt-1">
            {completedTasks} of {totalTasks} tasks completed
          </Text>
        </div>
      )}
    </Card>
  );
};

export default TaskStats;