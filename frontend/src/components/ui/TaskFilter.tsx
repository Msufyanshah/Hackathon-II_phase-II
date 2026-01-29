import React, { useState, useMemo } from 'react';
import { Task } from '../../lib/types';
import { BaseComponentProps } from '../../lib/types';

interface TaskFilterProps extends BaseComponentProps {
  tasks: Task[];
  onFilteredTasksChange?: (filteredTasks: Task[]) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  tasks,
  onFilteredTasksChange,
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Perform client-side filtering using data from GET /users/{userId}/tasks
  // No filtering parameters assumed unless defined in openapi.yaml
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply status filter
    if (filter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filter === 'completed') {
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
  }, [tasks, filter, searchTerm, onFilteredTasksChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search input */}
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              filter === 'active'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              filter === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{filteredTasks.length}</span> of{' '}
        <span className="font-medium">{tasks.length}</span> tasks
      </div>
    </div>
  );
};

export default TaskFilter;