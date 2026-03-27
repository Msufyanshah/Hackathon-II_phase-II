/**
 * Task Service Tests
 * Tests for task management functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskService } from '../services/tasks';

// Mock fetch API
global.fetch = vi.fn();

// Mock API client configuration
const mockToken = 'mock-jwt-token';

// Mock the api client
vi.mock('../lib/ApiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe('Task Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUserId = 'test-user-id-123';
  const mockTask = {
    id: 'task-id-123',
    title: 'Test Task',
    description: 'Test Description',
    is_completed: false,
    user_id: mockUserId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe('getUserTasks', () => {
    it('should fetch user tasks successfully', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 'task-2' }];

      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTasks }),
        })
      );

      const tasks = await TaskService.getUserTasks(mockUserId);

      expect(tasks).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/users/${mockUserId}/tasks`),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should handle empty task list', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        })
      );

      const tasks = await TaskService.getUserTasks(mockUserId);

      expect(tasks).toEqual([]);
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ detail: 'Unauthorized' }),
        })
      );

      await expect(TaskService.getUserTasks(mockUserId)).rejects.toThrow();
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockTask }),
        })
      );

      const task = await TaskService.createTask(
        mockUserId,
        'New Task',
        'New Description'
      );

      expect(task).toEqual(mockTask);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/users/${mockUserId}/tasks`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          }),
          body: JSON.stringify({
            title: 'New Task',
            description: 'New Description',
            completed: false,
          }),
        })
      );
    });

    it('should handle creation errors', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              detail: 'Title is required',
            }),
        })
      );

      await expect(
        TaskService.createTask(mockUserId, '', 'Description')
      ).rejects.toThrow();
    });
  });
});
