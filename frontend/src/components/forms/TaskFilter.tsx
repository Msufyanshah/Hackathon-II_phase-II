import React, { useState } from 'react';
import { BaseComponentProps } from '../../lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';

export interface TaskFilterProps extends BaseComponentProps {
  onFilterChange?: (filters: {
    searchTerm?: string;
    completedFilter?: 'all' | 'completed' | 'incomplete';
    sortBy?: 'created' | 'updated' | 'title';
    sortOrder?: 'asc' | 'desc';
  }) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  onFilterChange,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [completedFilter, setCompletedFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'title'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleApplyFilters = () => {
    onFilterChange?.({
      searchTerm: searchTerm.trim() || undefined,
      completedFilter,
      sortBy,
      sortOrder
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCompletedFilter('all');
    setSortBy('created');
    setSortOrder('desc');

    onFilterChange?.({
      searchTerm: undefined,
      completedFilter: 'all',
      sortBy: 'created',
      sortOrder: 'desc'
    });
  };

  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h3 className="text-lg font-medium mb-4">Filter Tasks</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Completed Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.value as 'all' | 'completed' | 'incomplete')}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created' | 'updated' | 'title')}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created">Created Date</option>
            <option value="updated">Updated Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3 mt-4">
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="secondary" onClick={handleResetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TaskFilter;