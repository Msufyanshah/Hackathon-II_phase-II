import React from 'react';
import { BaseComponentProps } from '../../lib/types';

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinnerClass = `${sizeClasses[size]} animate-spin rounded-full border-2 border-current border-t-transparent`;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} {...props}>
      <div className={spinnerClass} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      {label && <p className="mt-2 text-sm">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;