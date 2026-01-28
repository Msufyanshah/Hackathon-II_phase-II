import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export interface ProtectedRouteProps extends BaseComponentProps {
  redirectTo?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
  children,
}) => {
  const { state } = useAuth();
  const router = useRouter();

  // Mock router if not in Next.js context
  const mockRouter = {
    push: (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  };

  const effectiveRouter = router || mockRouter;

  // If still loading auth state, show loading indicator
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner label="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, redirect
  if (!state.isAuthenticated) {
    // In a real Next.js app, we would redirect
    // For now, we'll render a message
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ErrorMessage
          message="You must be logged in to access this page"
          variant="warning"
        />
        <div className="mt-4">
          <a
            href={redirectTo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;