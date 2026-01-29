import { z } from 'zod';
import { UserRegistrationRequest, UserLoginRequest, CreateTaskRequest, UpdateTaskRequest } from '../../lib/types';

// User Registration Schema - Validation MUST strictly conform to the corresponding schema in openapi.yaml
export const UserRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
});

// User Login Schema - Validation MUST strictly conform to the corresponding schema in openapi.yaml
export const UserLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Task Creation Schema - Validation MUST strictly conform to the corresponding schema in openapi.yaml
export const CreateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().optional(),
});

// Task Update Schema - Validation MUST strictly conform to the corresponding schema in openapi.yaml
export const UpdateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title must be at least 1 character')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().optional(),
});

// Validation utility functions
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

// Generic validation handler
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: any): { success: boolean; data?: T; error?: string } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map(e => e.message).join(', ');
    return { success: false, error: errors };
  }
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
};