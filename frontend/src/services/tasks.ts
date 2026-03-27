import apiClient from '../lib/ApiClient';
import { Task } from '../lib/types';

export class TaskService {
  /**
   * Rule 2: Backend validates JWT and UUID
   * Fetching tasks is a pure GET (No body allowed)
   */
   static async getUserTasks(userId: string): Promise<Task[]> {
  try {
    const url = `/api/users/${userId}/tasks`;
    console.log("Full API Request URL:", url); // CHECK THIS IN CONSOLE
    const response = await apiClient.get(url);
    return response.data?.data || response.data || [];
  } catch (error: any) {
    // This will now tell us EXACTLY what the backend is complaining about
    console.error('TaskService Detail:', error.response?.status, error.response?.data);
    throw error;
  }
}

  /**
   * Creating tasks uses POST with a data body
   */
  static async createTask(userId: string, title: string, description: string): Promise<Task> {
    try {
      const response = await apiClient.post(`/api/users/${userId}/tasks`, {
        title,
        description,
        completed: false
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Create Task Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Toggle task completion status using PATCH
   */
  static async toggleTaskCompletion(userId: string, taskId: string, completed: boolean): Promise<Task> {
    try {
      const response = await apiClient.patch(`/api/users/${userId}/tasks/${taskId}`, {
        completed
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Toggle Task Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(userId: string, taskId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/users/${userId}/tasks/${taskId}`);
    } catch (error: any) {
      console.error('Delete Task Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update a task using PUT
   */
  static async updateTask(userId: string, taskId: string, data: { title?: string; description?: string; completed?: boolean }): Promise<Task> {
    try {
      const response = await apiClient.put(`/api/users/${userId}/tasks/${taskId}`, data);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Update Task Error:', error.response?.data || error.message);
      throw error;
    }
  }
}