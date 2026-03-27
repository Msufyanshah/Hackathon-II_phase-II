// Comprehensive TypeScript interfaces matching openapi.yaml schemas

// User-related interfaces
export interface UserRegistrationRequest {
  /**
   * @pattern ^[^@]+@[^@]+\.[^@]+$
   * @minLength 5
   * @maxLength 255
   */
  email: string;

  /**
   * @minLength 8
   */
  password: string;

  /**
   * @minLength 3
   * @maxLength 50
   */
  username: string;
}

export interface UserLoginRequest {
  /**
   * @pattern ^[^@]+@[^@]+\.[^@]+$
   * @minLength 5
   * @maxLength 255
   */
  email: string;

  /**
   * @minLength 1
   */
  password: string;
}

export interface UserResponse {
  /**
   * @format uuid
   */
  id: string;

  /**
   * @format email
   */
  email: string;

  username: string;

  /**
   * @format date-time
   */
  created_at: string;
}

export interface LoginResponse {
  /**
   * JWT access token
   */
  access_token: string;

  /**
   * Type of token (usually "bearer")
   */
  token_type: string;

  user: UserResponse;
}

// Task-related interfaces
export interface CreateTaskRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string;

  /**
   * @maxLength 1000
   */
  description?: string;

  /**
   * @default false
   */
  completed?: boolean;
}

export interface UpdateTaskRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string;

  /**
   * @maxLength 1000
   */
  description?: string;

  completed?: boolean;
}

export interface TaskResponse {
  /**
   * @format uuid
   */
  id: string;

  /**
   * @maxLength 255
   */
  title: string;

  /**
   * @maxLength 1000
   */
  description?: string;

  completed: boolean;

  /**
   * @format uuid
   */
  user_id: string;

  /**
   * @format date-time
   */
  created_at: string;

  /**
   * @format date-time
   */
  updated_at: string;
}

// Error response interface
export interface ErrorResponse {
  /**
   * Error code
   */
  code: string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * ISO 8601 timestamp when error occurred
   * @format date-time
   */
  timestamp: string;

  /**
   * Request identifier for correlation (optional)
   * @format uuid
   */
  request_id?: string;
}

// API response wrappers
export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
}

// Authentication-related types
export interface JwtPayload {
  /**
   * User ID
   * @format uuid
   */
  sub: string;

  /**
   * Issuer
   */
  iss: string;

  /**
   * Expiration time
   * @format date-time
   */
  exp: number;

  /**
   * Issued at time
   * @format date-time
   */
  iat: number;
}

// Pagination-related interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API endpoint types
export interface ApiEndpoints {
  // Authentication endpoints
  auth: {
    register: '/auth/register';
    login: '/auth/login';
    logout: '/auth/logout';
    refresh: '/auth/refresh';
  };

  // User endpoints
  users: {
    me: '/users/me';
    getById: (userId: string) => `/users/${string}`;
    update: (userId: string) => `/users/${string}`;
    delete: (userId: string) => `/users/${string}`;
  };

  // Task endpoints
  tasks: {
    getUserTasks: (userId: string) => `/users/${string}/tasks`;
    createTask: (userId: string) => `/users/${string}/tasks`;
    getTask: (userId: string, taskId: string) => `/users/${string}/tasks/${string}`;
    updateTask: (userId: string, taskId: string) => `/users/${string}/tasks/${string}`;
    deleteTask: (userId: string, taskId: string) => `/users/${string}/tasks/${string}`;
    toggleCompletion: (userId: string, taskId: string) => `/users/${string}/tasks/${string}`;
  };
}

// Request body types for each endpoint
export interface ApiRequestBody {
  // Auth requests
  register: UserRegistrationRequest;
  login: UserLoginRequest;

  // Task requests
  createTask: CreateTaskRequest;
  updateTask: UpdateTaskRequest;
  toggleTaskCompletion: { completed: boolean };
}

// Response types for each endpoint
export interface ApiResponseTypes {
  // Auth responses
  register: UserResponse;
  login: LoginResponse;

  // User responses
  getMe: UserResponse;
  updateUser: UserResponse;

  // Task responses
  getUserTasks: TaskResponse[];
  createTask: TaskResponse;
  getTask: TaskResponse;
  updateTask: TaskResponse;
  toggleTaskCompletion: TaskResponse;
}

// API client configuration
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
}

// API client response type
export interface ApiClientResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// Validation schemas for API requests
export interface ValidationSchemas {
  userRegistration: {
    email: {
      required: true;
      pattern: RegExp;
      minLength: number;
      maxLength: number;
    };
    password: {
      required: true;
      minLength: number;
    };
    username: {
      required: true;
      minLength: number;
      maxLength: number;
    };
  };

  userLogin: {
    email: {
      required: true;
      pattern: RegExp;
    };
    password: {
      required: true;
    };
  };

  createTask: {
    title: {
      required: true;
      minLength: number;
      maxLength: number;
    };
    description: {
      required: false;
      maxLength: number;
    };
    completed: {
      required: false;
      default: boolean;
    };
  };

  updateTask: {
    title: {
      required: false;
      minLength: number;
      maxLength: number;
    };
    description: {
      required: false;
      maxLength: number;
    };
    completed: {
      required: false;
    };
  };
}

// Export all types for easy import
export type {
  UserRegistrationRequest as UserRegistrationRequestType,
  UserLoginRequest as UserLoginRequestType,
  UserResponse as UserResponseType,
  LoginResponse as LoginResponseType,
  CreateTaskRequest as CreateTaskRequestType,
  UpdateTaskRequest as UpdateTaskRequestType,
  TaskResponse as TaskResponseType,
  ErrorResponse as ErrorResponseType,
  ApiResponse as ApiResponseType,
  JwtPayload as JwtPayloadType,
  PaginationParams as PaginationParamsType,
  PaginatedResponse as PaginatedResponseType,
  ApiEndpoints as ApiEndpointsType,
  ApiRequestBody as ApiRequestBodyType,
  ApiResponseTypes as ApiResponseTypesType,
  ApiConfig as ApiConfigType,
  ApiClientResponse as ApiClientResponseType,
  ValidationSchemas as ValidationSchemasType
};

export default {
  // Re-export all interfaces for convenience
  UserRegistrationRequest,
  UserLoginRequest,
  UserResponse,
  LoginResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  ErrorResponse,
  ApiResponse,
  JwtPayload,
  PaginationParams,
  PaginatedResponse,
  ApiEndpoints,
  ApiRequestBody,
  ApiResponseTypes,
  ApiConfig,
  ApiClientResponse,
  ValidationSchemas
};