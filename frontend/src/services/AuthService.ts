import apiClient from '../lib/ApiClient';
import { User, UserRegistrationRequest, UserLoginRequest, LoginResponse } from '../lib/types';

class AuthService {
  async register(userData: UserRegistrationRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.register(userData);
      return response.data.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async login(credentials: UserLoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.login(credentials);
      const { access_token, user } = response.data.data;

      // Store token in API client
      apiClient.setToken(access_token);

      return { access_token, user };
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.getCurrentUser();
      return response.data.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async logout(): Promise<void> {
    // Remove token from API client
    apiClient.clearToken();
  }

  private handleError(error: any): string {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (data && data.error) {
        return data.error.message || `Server error: ${status}`;
      }

      return `Server error: ${status}`;
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error: Unable to reach server';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  }
}

export default new AuthService();