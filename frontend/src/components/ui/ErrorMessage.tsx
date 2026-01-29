import React from 'react';
import { BaseComponentProps } from '../../lib/types';

interface ErrorMessageProps extends BaseComponentProps {
  message?: string;
  error?: any; // Can be an error object or string
  variant?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  error,
  variant = 'error',
  className = '',
  ...props
}) => {
  // Handle different error formats
  let displayMessage = message;

  if (!displayMessage && error) {
    if (typeof error === 'string') {
      displayMessage = error;
    } else if (error.message) {
      displayMessage = error.message;
    } else if (error.response?.data?.message) {
      displayMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      displayMessage = error.response.data.error;
    } else if (Array.isArray(error)) {
      displayMessage = error.join(', ');
    } else {
      displayMessage = 'An unknown error occurred';
    }
  }

  if (!displayMessage) {
    return null;
  }

  // Handle specific HTTP error codes from openapi.yaml
  const getErrorDescription = (msg: string) => {
    if (msg.includes('400') || msg.toLowerCase().includes('bad request')) {
      return 'Bad Request: The request was invalid or malformed.';
    }
    if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
      return 'Unauthorized: Please log in to access this resource.';
    }
    if (msg.includes('403') || msg.toLowerCase().includes('forbidden')) {
      return 'Forbidden: You do not have permission to access this resource.';
    }
    if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
      return 'Not Found: The requested resource could not be found.';
    }
    if (msg.includes('409') || msg.toLowerCase().includes('conflict')) {
      return 'Conflict: The request conflicts with the current state of the resource.';
    }
    return msg;
  };

  const processedMessage = getErrorDescription(displayMessage);

  const variantClasses = {
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const classes = `p-4 mb-4 text-sm rounded-lg border ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} role="alert" {...props}>
      <div className="flex items-center">
        {variant === 'error' && (
          <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
        )}
        {variant === 'warning' && (
          <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
          </svg>
        )}
        {variant === 'info' && (
          <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
        )}
        <span>{processedMessage}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;