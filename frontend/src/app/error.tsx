'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Button from '../components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by global error page:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-gray-400 mb-4">500</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
        <p className="text-gray-600 mb-8">
          We're sorry, but something went wrong on our end. Please try again.
        </p>
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={reset}
            className="w-full"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;