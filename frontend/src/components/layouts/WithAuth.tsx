import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/BetterAuthContext';
import { useRouter } from 'next/router';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

// Higher-Order Component that wraps components requiring authentication
export function WithAuth<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  redirectIfNotAuthenticated = '/login'
) {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
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
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner label="Checking authentication..." />
        </div>
      );
    }

    // If not authenticated, redirect
    if (!isAuthenticated) {
      useEffect(() => {
        effectiveRouter.push(redirectIfNotAuthenticated);
      }, []);

      return (
        <div className="flex flex-col items-center justify-center h-64">
          <ErrorMessage
            message="You must be logged in to access this page"
            variant="warning"
          />
          <div className="mt-4">
            <a
              href={redirectIfNotAuthenticated}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      );
    }

    // If authenticated, render the wrapped component
    return <WrappedComponent {...props as P} />;
  };

  // Copy static methods and displayName from the wrapped component
  if (WrappedComponent.displayName || WrappedComponent.name) {
    AuthenticatedComponent.displayName = `WithAuth(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;
  }

  return AuthenticatedComponent;
}

export default WithAuth;