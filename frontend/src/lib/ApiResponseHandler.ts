import { ApiResponse, ApiError } from './types';

class ApiResponseHandler {
  static handleSuccess<T>(data: T): ApiResponse<T> {
    return { data };
  }

  static handleError(error: any): ApiResponse<null> {
    let apiError: ApiError;

    if (error.response) {
      // Server responded with error status
      const { status, data, statusText } = error.response;

      apiError = {
        code: `HTTP_${status}`,
        message: data?.detail || statusText || `HTTP ${status} Error`,
        timestamp: new Date().toISOString(),
        request_id: data?.request_id || undefined
      };
    } else if (error.request) {
      // Request was made but no response received
      apiError = {
        code: 'NETWORK_ERROR',
        message: 'Network error: Unable to reach server',
        timestamp: new Date().toISOString()
      };
    } else {
      // Something else happened
      apiError = {
        code: 'CLIENT_ERROR',
        message: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      };
    }

    return { error: apiError };
  }

  static isSuccess<T>(response: ApiResponse<T>): response is { data: T } {
    return response.data !== undefined && response.error === undefined;
  }

  static isError<T>(response: ApiResponse<T>): response is { error: ApiError } {
    return response.error !== undefined && response.data === undefined;
  }

  static getData<T>(response: ApiResponse<T>): T | null {
    return response.data || null;
  }

  static getError<T>(response: ApiResponse<T>): ApiError | null {
    return response.error || null;
  }
}

export default ApiResponseHandler;