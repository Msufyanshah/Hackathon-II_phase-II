import React, { useState } from 'react';
import { BaseComponentProps, UserRegistrationRequest } from '../../lib/types';
import FormField from './FormField';
import Button from '../ui/Button';
import { UserRegistrationSchema } from './FormValidation';
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

export interface RegisterFormProps extends BaseComponentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectAfterRegister?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  redirectAfterRegister = '/dashboard',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Prepare form data
    const formData: UserRegistrationRequest = { email, password, username };

    // Validate form data using schema from openapi.yaml - Validation MUST strictly conform to the corresponding schema in openapi.yaml
    const validationResult = UserRegistrationSchema.safeParse(formData);

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
      await register(email, password, username);
      onSuccess?.();

      // Redirect after successful registration
      if (redirectAfterRegister) {
        router.push(redirectAfterRegister);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Registration failed. Please try again.';
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
        label="Username"
        name="username"
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        required
      />

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
        placeholder="Create a password (min 8 characters)"
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
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;