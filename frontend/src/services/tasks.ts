import apiClient from '../lib/ApiClient';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../lib/types';
import { ApiResponse, TaskResponse, CreateTaskRequestType, UpdateTaskRequestType } from '../lib/api-types';

/**
 * TaskService - Methods for all task endpoints in openapi.yaml
 * Implements the complete CRUD operations for tasks following the API contract
 */
export class TaskService {
  /**
   * Get all tasks for a specific user
   * GET /users/{userId}/tasks
   */
  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/tasks`);
      return response.data.data as Task[];
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  }

  /**
   * Create a new task for a user
   * POST /users/{userId}/tasks
   */
  static async createTask(userId: string, taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post(`/users/${userId}/tasks`, taskData);
      return response.data.data as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Get a specific task by ID
   * GET /users/{userId}/tasks/{taskId}
   */
  static async getTaskById(userId: string, taskId: string): Promise<Task> {
    try {
      const response = await apiClient.get(`/users/${userId}/tasks/${taskId}`);
      return response.data.data as Task;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   * PUT /users/{userId}/tasks/{taskId}
   */
  static async updateTask(userId: string, taskId: string, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.put(`/users/${userId}/tasks/${taskId}`, taskData);
      return response.data.data as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Delete a specific task
   * DELETE /users/{userId}/tasks/{taskId}
   */
  static async deleteTask(userId: string, taskId: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Toggle task completion status
   * PATCH /users/{userId}/tasks/{taskId}
   */
  static async toggleTaskCompletion(userId: string, taskId: string, completed: boolean): Promise<Task> {
    try {
      const response = await apiClient.patch(`/users/${userId}/tasks/${taskId}`, { completed });
      return response.data.data as Task;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  /**
   * Batch update tasks (if supported by API)
   * PUT /users/{userId}/tasks/batch
   */
  static async batchUpdateTasks(userId: string, updates: Array<{ taskId: string; data: UpdateTaskRequest }>): Promise<Task[]> {
    try {
      const payload = updates.map(update => ({
        taskId: update.taskId,
        ...update.data
      }));

      const response = await apiClient.put(`/users/${userId}/tasks/batch`, payload);
      return response.data.data as Task[];
    } catch (error) {
      console.error('Error batch updating tasks:', error);
      throw error;
    }
  }

  /**
   * Bulk delete tasks (if supported by API)
   * DELETE /users/{userId}/tasks/bulk
   */
  static async bulkDeleteTasks(userId: string, taskIds: string[]): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}/tasks/bulk`, { data: { taskIds } });
    } catch (error) {
      console.error('Error bulk deleting tasks:', error);
      throw error;
    }
  }

  /**
   * Filter tasks by various criteria (client-side filtering)
   * NOTE: Server-side filtering would require API endpoint support
   */
  static filterTasks(tasks: Task[], filters: {
    completed?: boolean;
    searchTerm?: string;
    dateRange?: { start: Date; end: Date };
  }): Task[] {
    return tasks.filter(task => {
      // Filter by completion status
      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false;
      }

      // Filter by search term in title or description
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (!task.title.toLowerCase().includes(term) &&
            !(task.description && task.description.toLowerCase().includes(term))) {
          return false;
        }
      }

      // Filter by date range
      if (filters.dateRange) {
        const taskDate = new Date(task.created_at);
        if (taskDate < filters.dateRange.start || taskDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Sort tasks by various criteria
   */
  static sortTasks(tasks: Task[], sortBy: 'created_at' | 'updated_at' | 'title' | 'completed', order: 'asc' | 'desc' = 'desc'): Task[] {
    return [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'completed':
          comparison = a.completed === b.completed ? 0 : a.completed ? 1 : -1;
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Get task statistics
   */
  static getTaskStatistics(tasks: Task[]) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      completionRate: parseFloat(completionRate.toFixed(2)),
      tasksByStatus: {
        completed,
        pending
      }
    };
  }
}

export default TaskService;