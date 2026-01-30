import React, { useState, useMemo } from 'react';
import { Task } from '../../lib/types';
import { BaseComponentProps } from '../../lib/types';
import { Input, Button } from '.';

interface TaskFilterProps extends BaseComponentProps {
  tasks: Task[];
  onFilteredTasksChange?: (filteredTasks: Task[]) => void;
  showResultsCount?: boolean;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  tasks,
  onFilteredTasksChange,
  showResultsCount = true,
  className = ''
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Perform client-side filtering for filtering task lists
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply status filter
    if (statusFilter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Notify parent component of filtered tasks
    if (onFilteredTasksChange) {
      onFilteredTasksChange(result);
    }

    return result;
  }, [tasks, statusFilter, searchTerm, onFilteredTasksChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search input */}
        <div className="w-full lg:w-auto flex-1">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {showResultsCount && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredTasks.length}</span> of{' '}
          <span className="font-medium">{tasks.length}</span> tasks
        </div>
      )}
    </div>
  );
};

export default TaskFilter;