import React from 'react';
import { BaseComponentProps } from '../../lib/types';
import { Button } from './Button';
import { Card } from './Card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error: Error | null; errorInfo?: React.ErrorInfo | null; resetError?: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback component if provided, otherwise use default
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

// Default fallback UI for unexpected errors
interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo?: React.ErrorInfo | null;
  resetError?: () => void;
  className?: string;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  className = ''
}) => {
  return (
    <Card className={`p-6 m-4 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          We apologize for the inconvenience. Our team has been notified.
        </p>

        {error && (
          <details className="mb-4 text-left text-sm text-gray-700 bg-gray-50 p-4 rounded">
            <summary className="cursor-pointer">Error details</summary>
            <p className="mt-2"><strong>Error:</strong> {error.toString()}</p>
            {errorInfo && (
              <pre className="mt-2 whitespace-pre-wrap bg-white p-2 rounded border">
                {errorInfo.componentStack}
              </pre>
            )}
          </details>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={resetError}
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Higher-order component version for wrapping individual components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  return (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;