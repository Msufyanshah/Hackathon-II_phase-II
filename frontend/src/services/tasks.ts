import { title } from 'process';
import apiClient from '../lib/ApiClient';
import { Task } from '../lib/types';

export class TaskService {
  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      // Note: Ensure your FastAPI route matches this exactly
      const response = await apiClient.get(`/api/users/${userId}/tasks`,{
       title,
       describtion,
       completed: false
    });
      
      return response.data?.data || response.data || [];
    } catch (error: any) {
      console.error('TaskService Error Details:', error.response?.data || error.message);
      throw error;
    }
  }
}