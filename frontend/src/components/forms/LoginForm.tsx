import React, { useState } from 'react';
import { BaseComponentProps, UserLoginRequest } from '../../lib/types';
import FormField from './FormField';
import Button from '../ui/Button';
import { validateUserLogin } from './FormValidation';
import { useAuth } from '../../contexts/AuthContext';

// Mock router since we're not in a Next.js component yet
const mockRouter = {
  push: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }
};

// Use mock router or real router depending on context
const useRouter = () => mockRouter;

export interface LoginFormProps extends BaseComponentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectAfterLogin?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  redirectAfterLogin = '/dashboard',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Prepare form data
    const formData: UserLoginRequest = { email, password };

    // Validate form data
    const validationResult = validateUserLogin(formData);

    if (!validationResult.success) {
      // Convert Zod errors to our format
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        newErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(newErrors);
      setIsLoading(false);
      onError?.('Please fix the errors in the form');
      return;
    }

    try {
      await login(email, password);
      onSuccess?.();

      // Redirect after successful login
      if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed. Please try again.';
      setErrors({ general: errorMsg });
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {errors.general && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {errors.general}
        </div>
      )}

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;