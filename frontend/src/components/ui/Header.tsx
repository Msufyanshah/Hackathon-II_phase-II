import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import { useAuth } from '../../contexts/BetterAuthContext';
import { Button } from '.';

export interface HeaderProps extends BaseComponentProps {
  title?: string;
  showAuthControls?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Todo App',
  showAuthControls = true,
  className = '',
  ...props
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={`bg-white shadow-sm ${className}`} {...props}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>

        {showAuthControls && (
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <Button variant="secondary" onClick={logout}>Logout</Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary">Login</Button>
                <Button variant="primary">Sign Up</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;