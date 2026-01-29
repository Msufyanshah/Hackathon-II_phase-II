import React from 'react';
import { BaseComponentProps } from '../../lib/types';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-blue-500 border-t-transparent`}></div>
      {label && <span className="mt-2 text-sm text-gray-600">{label}</span>}
    </div>
  );
};

interface SkeletonProps extends BaseComponentProps {
  height?: string;
  width?: string;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = 'h-4',
  width = 'w-full',
  borderRadius = 'rounded',
  className = ''
}) => {
  return (
    <div className={`${height} ${width} ${borderRadius} bg-gray-200 animate-pulse ${className}`}></div>
  );
};

interface LoadingWrapperProps extends BaseComponentProps {
  isLoading: boolean;
  loaderSize?: 'sm' | 'md' | 'lg';
  loaderLabel?: string;
  skeletonCount?: number;
  skeletonHeight?: string;
  skeletonWidth?: string;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  loaderSize = 'md',
  loaderLabel = 'Loading...',
  skeletonCount = 3,
  skeletonHeight = 'h-4',
  skeletonWidth = 'w-full',
  children,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <LoadingSpinner size={loaderSize} label={loaderLabel} />
        <div className="space-y-2">
          {[...Array(skeletonCount)].map((_, index) => (
            <Skeleton
              key={index}
              height={skeletonHeight}
              width={skeletonWidth}
              className="mb-2"
            />
          ))}
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Loading states for API interactions - implementing proper loading states for all API interactions
interface DataLoaderProps<T> extends BaseComponentProps {
  data: T | null;
  loading: boolean;
  error: string | null;
  loaderSize?: 'sm' | 'md' | 'lg';
  loaderLabel?: string;
  skeletonCount?: number;
  renderData: (data: T) => React.ReactNode;
  renderError?: (error: string) => React.ReactNode;
}

export const DataLoader = <T extends {}>({
  data,
  loading,
  error,
  loaderSize = 'md',
  loaderLabel = 'Loading...',
  skeletonCount = 3,
  renderData,
  renderError,
  className = ''
}: DataLoaderProps<T>) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <LoadingSpinner size={loaderSize} label={loaderLabel} />
        <div className="space-y-2">
          {[...Array(skeletonCount)].map((_, index) => (
            <Skeleton key={index} className="mb-2" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    if (renderError) {
      return <div className={className}>{renderError(error)}</div>;
    }

    return (
      <div className={`bg-red-50 text-red-700 p-4 rounded ${className}`} role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>No data available</p>
      </div>
    );
  }

  return <div className={className}>{renderData(data)}</div>;
};

// Add loading spinners and skeleton screens for improved UX
interface SpinnerButtonProps extends BaseComponentProps {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const SpinnerButton: React.FC<SpinnerButtonProps> = ({
  loading,
  loadingText = 'Loading...',
  children,
  className = ''
}) => {
  return (
    <button
      disabled={loading}
      className={`relative ${className}`}
    >
      {loading && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LoadingSpinner size="sm" />
        </span>
      )}
      <span className={loading ? 'pl-8' : ''}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

// Skeleton screen for entire page loading
interface PageSkeletonProps extends BaseComponentProps {
  rows?: number;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  rows = 5,
  className = ''
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

      {[...Array(rows)].map((_, idx) => (
        <div key={idx} className="flex items-center mb-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Add proper loading states and skeleton components for all API-dependent components
interface APILoadingWrapperProps extends BaseComponentProps {
  loading: boolean;
  error: string | null;
  data: any | null;
  skeletonComponent?: React.ReactNode;
  skeletonCount?: number;
  retryFunction?: () => void;
  children: React.ReactNode;
}

export const APILoadingWrapper: React.FC<APILoadingWrapperProps> = ({
  loading,
  error,
  data,
  skeletonComponent,
  skeletonCount = 3,
  retryFunction,
  children,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <LoadingSpinner label="Loading data..." />
        <div className="space-y-3">
          {skeletonComponent ? (
            [...Array(skeletonCount)].map((_, idx) => (
              <div key={idx}>{skeletonComponent}</div>
            ))
          ) : (
            [...Array(skeletonCount)].map((_, idx) => (
              <Skeleton key={idx} className="mb-2" />
            ))
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded ${className}`}>
        <p className="font-bold">Error Loading Data</p>
        <p>{error}</p>
        {retryFunction && (
          <button
            onClick={retryFunction}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>No data available</p>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Skeleton components for specific UI elements
export const TaskSkeleton: React.FC<BaseComponentProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center p-4 border rounded-lg ${className}`}>
      <div className="h-5 w-5 rounded bg-gray-200 mr-3"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export const UserCardSkeleton: React.FC<BaseComponentProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export { LoadingSpinner as default };