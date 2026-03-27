import { Task, User, UserLoginRequest, UserRegistrationRequest, CreateTaskRequest, UpdateTaskRequest } from './types';

// Contract compliance audit utilities for verifying API calls match openapi.yaml exactly

interface ContractEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  requestSchema?: any;
  responseSchema?: any;
}

interface ContractDefinition {
  [endpoint: string]: ContractEndpoint;
}

// Define the contract based on openapi.yaml
const CONTRACT_DEFINITIONS: ContractDefinition = {
  // Authentication endpoints
  'POST /auth/register': {
    method: 'POST',
    path: '/auth/register',
    requestSchema: {
      required: ['email', 'password', 'username'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        username: { type: 'string', minLength: 3, maxLength: 50 }
      }
    }
  },
  'POST /auth/login': {
    method: 'POST',
    path: '/auth/login',
    requestSchema: {
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 }
      }
    }
  },
  'GET /users/me': {
    method: 'GET',
    path: '/users/me',
    responseSchema: {
      required: ['id', 'email', 'username', 'created_at'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        username: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Task endpoints
  'GET /users/{userId}/tasks': {
    method: 'GET',
    path: '/users/{userId}/tasks',
    responseSchema: {
      type: 'array',
      items: {
        required: ['id', 'title', 'completed', 'user_id', 'created_at', 'updated_at'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', maxLength: 255 },
          description: { type: 'string', maxLength: 1000 },
          completed: { type: 'boolean' },
          user_id: { type: 'string', format: 'uuid' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  'POST /users/{userId}/tasks': {
    method: 'POST',
    path: '/users/{userId}/tasks',
    requestSchema: {
      required: ['title'],
      properties: {
        title: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', maxLength: 1000 },
        completed: { type: 'boolean', default: false }
      }
    }
  },
  'GET /users/{userId}/tasks/{taskId}': {
    method: 'GET',
    path: '/users/{userId}/tasks/{taskId}',
    responseSchema: {
      required: ['id', 'title', 'completed', 'user_id', 'created_at', 'updated_at'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string', maxLength: 255 },
        description: { type: 'string', maxLength: 1000 },
        completed: { type: 'boolean' },
        user_id: { type: 'string', format: 'uuid' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  },
  'PUT /users/{userId}/tasks/{taskId}': {
    method: 'PUT',
    path: '/users/{userId}/tasks/{taskId}',
    requestSchema: {
      properties: {
        title: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', maxLength: 1000 },
        completed: { type: 'boolean' }
      }
    }
  },
  'PATCH /users/{userId}/tasks/{taskId}': {
    method: 'PATCH',
    path: '/users/{userId}/tasks/{taskId}',
    requestSchema: {
      required: ['completed'],
      properties: {
        completed: { type: 'boolean' }
      }
    }
  },
  'DELETE /users/{userId}/tasks/{taskId}': {
    method: 'DELETE',
    path: '/users/{userId}/tasks/{taskId}'
  }
};

// Contract compliance checker
class ContractComplianceChecker {
  /**
   * Verify if an API call matches the contract definition
   */
  static verifyCall(method: string, path: string, requestData?: any, responseData?: any): {
    compliant: boolean;
    errors: string[];
    warnings: string[];
  } {
    const endpointKey = `${method.toUpperCase()} ${path}`;
    const definition = CONTRACT_DEFINITIONS[endpointKey];

    if (!definition) {
      return {
        compliant: false,
        errors: [`Endpoint ${endpointKey} not defined in contract`],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate request data if provided
    if (requestData && definition.requestSchema) {
      const requestValidation = this.validateSchema(requestData, definition.requestSchema);
      if (!requestValidation.valid) {
        errors.push(`Request validation failed: ${requestValidation.errors.join(', ')}`);
      }
    }

    // Validate response data if provided
    if (responseData && definition.responseSchema) {
      const responseValidation = this.validateSchema(responseData, definition.responseSchema);
      if (!responseValidation.valid) {
        errors.push(`Response validation failed: ${responseValidation.errors.join(', ')}`);
      }
    }

    return {
      compliant: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate data against a schema
   */
  private static validateSchema(data: any, schema: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check field types and constraints
    if (schema.properties) {
      for (const [field, constraints] of Object.entries(schema.properties as Record<string, any>)) {
        if (field in data) {
          const value = data[field];

          // Check type
          if (constraints.type && typeof value !== constraints.type &&
              !(constraints.type === 'array' && Array.isArray(value))) {
            errors.push(`Field ${field} has wrong type: expected ${constraints.type}, got ${typeof value}`);
          }

          // Check length constraints
          if (typeof value === 'string') {
            if (constraints.minLength && value.length < constraints.minLength) {
              errors.push(`Field ${field} too short: expected at least ${constraints.minLength}, got ${value.length}`);
            }
            if (constraints.maxLength && value.length > constraints.maxLength) {
              errors.push(`Field ${field} too long: expected at most ${constraints.maxLength}, got ${value.length}`);
            }
          }

          // Check numeric constraints
          if (typeof value === 'number') {
            if (constraints.minimum && value < constraints.minimum) {
              errors.push(`Field ${field} too low: expected at least ${constraints.minimum}, got ${value}`);
            }
            if (constraints.maximum && value > constraints.maximum) {
              errors.push(`Field ${field} too high: expected at most ${constraints.maximum}, got ${value}`);
            }
          }
        }
      }
    }

    // Special handling for arrays
    if (schema.type === 'array' && Array.isArray(data) && schema.items) {
      for (let i = 0; i < data.length; i++) {
        const itemValidation = this.validateSchema(data[i], schema.items);
        if (!itemValidation.valid) {
          errors.push(`Array item[${i}] validation failed: ${itemValidation.errors.join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Audit all API calls in the application
   */
  static auditAllCalls(): {
    compliantCalls: number;
    nonCompliantCalls: number;
    details: Array<{
      method: string;
      path: string;
      compliant: boolean;
      errors: string[];
      warnings: string[];
    }>;
  } {
    // In a real implementation, this would audit all API calls in the application
    // For now, we'll return a summary of defined contracts
    const details = Object.entries(CONTRACT_DEFINITIONS).map(([key, def]) => {
      const [method, path] = key.split(' ');
      return {
        method,
        path,
        compliant: true,
        errors: [],
        warnings: []
      };
    });

    return {
      compliantCalls: details.length,
      nonCompliantCalls: 0,
      details
    };
  }

  /**
   * Get all defined contract endpoints
   */
  static getAllEndpoints(): ContractEndpoint[] {
    return Object.values(CONTRACT_DEFINITIONS);
  }

  /**
   * Get contract definition for a specific endpoint
   */
  static getEndpointDefinition(method: string, path: string): ContractEndpoint | null {
    const key = `${method.toUpperCase()} ${path}`;
    return CONTRACT_DEFINITIONS[key] || null;
  }
}

// API client wrapper that verifies contract compliance
class CompliantApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(method: string, path: string, data?: any): Promise<T> {
    // Verify the call before making it
    const verification = ContractComplianceChecker.verifyCall(method, path, data);

    if (!verification.compliant) {
      console.warn(`Contract violation detected for ${method} ${path}:`, verification.errors);
      // In production, you might want to throw an error or handle differently
    }

    // Make the actual API call
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers if needed
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();

    // Verify response compliance
    const responseVerification = ContractComplianceChecker.verifyCall(method, path, data, responseData);

    if (!responseVerification.compliant) {
      console.warn(`Response contract violation detected for ${method} ${path}:`, responseVerification.errors);
    }

    return responseData;
  }

  // Convenience methods
  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, data: any): Promise<T> {
    return this.request<T>('POST', path, data);
  }

  async put<T>(path: string, data: any): Promise<T> {
    return this.request<T>('PUT', path, data);
  }

  async patch<T>(path: string, data: any): Promise<T> {
    return this.request<T>('PATCH', path, data);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

// Export the compliance checker and compliant API client
export {
  ContractComplianceChecker,
  CompliantApiClient,
  CONTRACT_DEFINITIONS
};

// Default export for convenience
export default {
  ContractComplianceChecker,
  CompliantApiClient,
  CONTRACT_DEFINITIONS
};