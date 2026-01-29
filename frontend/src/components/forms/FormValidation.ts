import { z } from 'zod';
import { UserRegistrationRequest, UserLoginRequest, CreateTaskRequest, UpdateTaskRequest } from '../../lib/types';

// User Registration Schema with validation matching openapi.yaml
export const UserRegistrationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters'),

  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
});

// User Login Schema with validation matching openapi.yaml
export const UserLoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .max(128, 'Password must not exceed 128 characters'),
});

// Task Creation Schema with validation matching openapi.yaml
export const CreateTaskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),

  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),

  completed: z
    .boolean()
    .optional()
    .default(false),
});

// Task Update Schema with validation matching openapi.yaml
export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be at least 1 character')
    .max(255, 'Title must not exceed 255 characters')
    .optional(),

  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),

  completed: z
    .boolean()
    .optional(),
});

// Validation utility functions that implement schema validation matching openapi.yaml
export const validateUserRegistration = (data: UserRegistrationRequest) => {
  return UserRegistrationSchema.safeParse(data);
};

export const validateUserLogin = (data: UserLoginRequest) => {
  return UserLoginSchema.safeParse(data);
};

export const validateCreateTask = (data: CreateTaskRequest) => {
  return CreateTaskSchema.safeParse(data);
};

export const validateUpdateTask = (data: UpdateTaskRequest) => {
  return UpdateTaskSchema.safeParse(data);
};

// Generic validation handler with detailed error messages
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: any) => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // Format errors to be more user-friendly
    const errors = result.error.errors.reduce((acc, curr) => {
      acc[curr.path.join('.')] = curr.message;
      return acc;
    }, {} as Record<string, string>);

    return {
      success: false,
      errors,
      error: result.error
    };
  }
};

// Validation helper for forms with error formatting
export const getFormattedErrors = (error: z.ZodError) => {
  return error.errors.reduce((acc, curr) => {
    acc[curr.path.join('.')] = curr.message;
    return acc;
  }, {} as Record<string, string>);
};

// Validation function that returns a flat array of error messages
export const getErrorMessages = (error: z.ZodError) => {
  return error.errors.map(e => e.message);
};

export default {
  UserRegistrationSchema,
  UserLoginSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  validateUserRegistration,
  validateUserLogin,
  validateCreateTask,
  validateUpdateTask,
  validateFormData,
  getFormattedErrors,
  getErrorMessages,
};