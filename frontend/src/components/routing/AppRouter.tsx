import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../layouts/ProtectedRoute';
import UnauthorizedPage from '../ui/UnauthorizedPage';
import { useRouter } from 'next/navigation';

interface AppRouterProps extends BaseComponentProps {
  children: React.ReactNode;
}

const AppRouter: React.FC<AppRouterProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // During loading state, return null or a loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // For public routes, allow access
  // For protected routes, wrap with ProtectedRoute
  // This router would normally handle route definitions, but in Next.js
  // the routing is handled by the file system structure
  // So we'll ensure proper authentication checks are in place

  return (
    <div>
      {/* For protected routes, we can wrap content with ProtectedRoute */}
      {children}
    </div>
  );
};

// Export a higher-order component for protected routes
export const withProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => (
    <ProtectedRoute>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );
};

// Export a hook for checking authentication in components
export const useAuthGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return { isAuthenticated: null, isLoading: true }; // null indicates uncertain state
  }

  return { isAuthenticated: !!user, isLoading: false };
};

export default AppRouter;