import React, { useState, useEffect } from 'react';
import { BaseComponentProps } from '../../lib/types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export interface DataLoaderProps<T> extends BaseComponentProps {
  loaderFn: () => Promise<T>;
  children: (data: T) => React.ReactNode;
  loadingLabel?: string;
  errorVariant?: 'error' | 'warning' | 'info';
}

const DataLoader = <T extends {}>({
  loaderFn,
  children,
  loadingLabel = 'Loading data...',
  errorVariant = 'error',
  className = '',
}: DataLoaderProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await loaderFn();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <LoadingSpinner label={loadingLabel} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        variant={errorVariant}
        className={className}
      />
    );
  }

  if (data === null) {
    return (
      <ErrorMessage
        message="No data available"
        variant="info"
        className={className}
      />
    );
  }

  return <div className={className}>{children(data)}</div>;
};

export default DataLoader;