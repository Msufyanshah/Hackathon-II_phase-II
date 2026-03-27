import { z } from 'zod';
import {
  User,
  UserRegistrationRequest,
  UserLoginRequest,
  LoginResponse,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiError
} from './types';

// Define Zod schemas that match the openapi.yaml schemas exactly
export const UserSchema: z.ZodSchema<User> = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  created_at: z.string().datetime(),
});

export const UserRegistrationRequestSchema: z.ZodSchema<UserRegistrationRequest> = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(50),
});

export const UserLoginRequestSchema: z.ZodSchema<UserLoginRequest> = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginResponseSchema: z.ZodSchema<LoginResponse> = z.object({
  access_token: z.string(),
  token_type: z.string(),
  user: UserSchema,
});

export const TaskSchema: z.ZodSchema<Task> = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateTaskRequestSchema: z.ZodSchema<CreateTaskRequest> = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
});

export const UpdateTaskRequestSchema: z.ZodSchema<UpdateTaskRequest> = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
});

export const ApiErrorSchema: z.ZodSchema<ApiError> = z.object({
  code: z.string(),
  message: z.string(),
  timestamp: z.string().datetime(),
  request_id: z.string().uuid().optional(),
});

// Validation functions that implement proper request/response validation matching openapi.yaml schemas
export const validateApiResponse = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: boolean; data?: T; error?: z.ZodError } => {
  try {
    const parsedData = schema.parse(data);
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    return { success: false, error: new z.ZodError([]) };
  }
};

export const validateRequestBody = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: boolean; data?: T; error?: z.ZodError } => {
  return validateApiResponse(data, schema);
};

export const validateApiResponseBody = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: boolean; data?: T; error?: z.ZodError } => {
  return validateApiResponse(data, schema);
};

// Export all schemas for use in validation
export {
  UserSchema,
  UserRegistrationRequestSchema,
  UserLoginRequestSchema,
  LoginResponseSchema,
  TaskSchema,
  CreateTaskRequestSchema,
  UpdateTaskRequestSchema,
  ApiErrorSchema,
};