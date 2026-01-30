import React from 'react';
import Link from 'next/link';
import { Button } from '.';
import { BaseComponentProps } from '../../lib/types';

interface UnauthorizedPageProps extends BaseComponentProps {
  message?: string;
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  message = "You don't have permission to access this page.",
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-gray-400 mb-4">403</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          {message}
        </p>
        <Link href="/login">
          <Button variant="primary">
            Sign In
          </Button>
        </Link>
        <div className="mt-4">
          <Link href="/">
            <Button variant="secondary">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;