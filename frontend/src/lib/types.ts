import React from 'react';

// Global TypeScript interfaces and types

// User types - matching openapi.yaml schemas
export interface User {
  id: string; // format: uuid
  email: string; // format: email
  username: string;
  created_at: string; // format: date-time
}

export interface UserRegistrationRequest {
  email: string; // format: email
  password: string; // minLength: 8
  username: string; // minLength: 3, maxLength: 50
}

export interface UserLoginRequest {
  email: string; // format: email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Task types - matching openapi.yaml schemas
export interface Task {
  id: string; // format: uuid
  title: string;
  description?: string;
  completed: boolean;
  user_id: string; // format: uuid
  created_at: string; // format: date-time
  updated_at: string; // format: date-time
}

export interface CreateTaskRequest {
  title: string; // minLength: 1, maxLength: 255
  description?: string; // maxLength: 1000
  completed?: boolean; // default: false
}

export interface UpdateTaskRequest {
  title?: string; // minLength: 1, maxLength: 255
  description?: string; // maxLength: 1000
  completed?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  request_id?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}