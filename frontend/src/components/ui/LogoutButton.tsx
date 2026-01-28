import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

export interface LogoutButtonProps extends BaseComponentProps {
  onLogout?: () => void;
  redirectAfterLogout?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  redirectAfterLogout = '/login',
  variant = 'secondary',
  size = 'md',
  children = 'Logout',
  ...props
}) => {
  const { logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
      onLogout?.();

      // Redirect after logout
      if (redirectAfterLogout) {
        effectiveRouter.push(redirectAfterLogout);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;