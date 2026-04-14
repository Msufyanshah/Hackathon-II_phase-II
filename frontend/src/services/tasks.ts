import apiClient from '../lib/ApiClient';
import { Task } from '../lib/types';

export class TaskService {
  static async getUserTasks(
    userId: string,
    params?: { search?: string; completed?: boolean; sort_by?: string; sort_order?: string }
  ): Promise<Task[]> {
    try {
      const url = `/api/users/${userId}/tasks`;
      const response = await apiClient.get(url, { params });
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw error;
    }
  }

  static async createTask(
    userId: string,
    data: { title: string; description?: string }
  ): Promise<Task> {
    try {
      const response = await apiClient.post(`/api/users/${userId}/tasks`, {
        title: data.title,
        description: data.description,
        completed: false,
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async toggleTaskCompletion(userId: string, taskId: string, completed: boolean): Promise<Task> {
    try {
      const response = await apiClient.patch(`/api/users/${userId}/tasks/${taskId}`, {
        completed
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/users/${userId}/tasks/${taskId}`);
    } catch (error: any) {
      throw error;
    }
  }

  static async updateTask(userId: string, taskId: string, data: { title?: string; description?: string; completed?: boolean }): Promise<Task> {
    try {
      const response = await apiClient.put(`/api/users/${userId}/tasks/${taskId}`, data);
      return response.data?.data || response.data;
    } catch (error: any) {
      throw error;
    }
  }
}
