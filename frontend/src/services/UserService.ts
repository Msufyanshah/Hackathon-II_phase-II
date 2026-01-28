import apiClient from '../lib/ApiClient';
import { User } from '../lib/types';

class UserService {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.getCurrentUser();
      return response.data.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
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

export default new UserService();