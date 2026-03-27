import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import { Button } from '.';

export interface SimpleTaskFilterProps extends BaseComponentProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TaskFilter: React.FC<SimpleTaskFilterProps> = ({
  filter,
  onFilterChange,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant={filter === 'all' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        All
      </Button>
      <Button
        variant={filter === 'active' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('active')}
      >
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </Button>
    </div>
  );
};

export default TaskFilter;