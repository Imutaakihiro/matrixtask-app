import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from '../../../src/services/StorageService';
import { TaskService } from '../../../src/services/TaskService';
import { TursoClient } from '../../../src/services/TursoClient';
import type { Client } from '@libsql/client';

describe('StorageService (Turso)', () => {
  let storageService: StorageService;
  let taskService: TaskService;
  let mockClient: Partial<Client>;
  let mockData: any[];

  beforeEach(() => {
    // Tursoクライアントをモック
    mockData = [];

    mockClient = {
      execute: vi.fn(async (sql: string) => {
        if (sql === 'SELECT * FROM tasks') {
          return {
            rows: mockData,
            columns: [],
            rowsAffected: 0,
            lastInsertRowid: null,
          };
        }
        if (sql === 'DELETE FROM tasks') {
          mockData = [];
          return {
            rows: [],
            columns: [],
            rowsAffected: mockData.length,
            lastInsertRowid: null,
          };
        }
        return {
          rows: [],
          columns: [],
          rowsAffected: 0,
          lastInsertRowid: null,
        };
      }),
      batch: vi.fn(async (statements: any[]) => {
        // INSERT OR REPLACE をシミュレート
        statements.forEach((stmt) => {
          if (stmt.sql.includes('INSERT OR REPLACE')) {
            const [
              id,
              title,
              description,
              quadrant,
              isPinnedToToday,
              dueDate,
              tags,
              createdAt,
              updatedAt,
              completedAt,
            ] = stmt.args;

            mockData.push({
              id,
              title,
              description,
              quadrant,
              is_pinned_to_today: isPinnedToToday,
              due_date: dueDate,
              tags,
              created_at: createdAt,
              updated_at: updatedAt,
              completed_at: completedAt,
            });
          }
        });

        return [];
      }),
    };

    vi.spyOn(TursoClient, 'getClient').mockReturnValue(mockClient as Client);

    storageService = new StorageService();
    taskService = new TaskService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveTasks', () => {
    it('should save tasks to Turso database', async () => {
      const task1 = taskService.createTask({ title: 'Task 1' });
      const task2 = taskService.createTask({ title: 'Task 2' });
      const tasks = [task1, task2];

      await storageService.saveTasks(tasks);

      expect(mockClient.batch).toHaveBeenCalled();
      expect(mockData).toHaveLength(2);
    });

    it('should save empty array', async () => {
      await storageService.saveTasks([]);

      expect(mockClient.batch).toHaveBeenCalled();
      expect(mockData).toEqual([]);
    });
  });

  describe('loadTasks', () => {
    it('should load tasks from Turso database', async () => {
      const task1 = taskService.createTask({ title: 'Task 1' });
      const task2 = taskService.createTask({ title: 'Task 2' });
      const tasks = [task1, task2];

      await storageService.saveTasks(tasks);
      const loaded = await storageService.loadTasks();

      expect(loaded).toHaveLength(2);
      expect(loaded[0].title).toBe('Task 1');
      expect(loaded[1].title).toBe('Task 2');
    });

    it('should return empty array when no data exists', async () => {
      const loaded = await storageService.loadTasks();
      expect(loaded).toEqual([]);
    });

    it('should convert date strings back to Date objects', async () => {
      const dueDate = new Date('2026-12-31');
      const task = taskService.createTask({ title: 'Task', dueDate });

      await storageService.saveTasks([task]);
      const loaded = await storageService.loadTasks();

      expect(loaded[0].dueDate).toBeInstanceOf(Date);
      expect(loaded[0].dueDate?.getTime()).toBe(dueDate.getTime());
    });

    it('should convert is_pinned_to_today from INTEGER to boolean', async () => {
      const task = taskService.createTask({ title: 'Task' });
      const pinnedTask = taskService.pinTaskToToday(task);

      await storageService.saveTasks([pinnedTask]);
      const loaded = await storageService.loadTasks();

      expect(loaded[0].isPinnedToToday).toBe(true);
      expect(typeof loaded[0].isPinnedToToday).toBe('boolean');
    });
  });

  describe('clear', () => {
    it('should clear tasks from Turso database', async () => {
      const task = taskService.createTask({ title: 'Task' });
      await storageService.saveTasks([task]);

      await storageService.clear();

      expect(mockClient.execute).toHaveBeenCalledWith('DELETE FROM tasks');
      expect(mockData).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle database save errors', async () => {
      vi.spyOn(mockClient, 'batch').mockRejectedValue(
        new Error('Database error')
      );

      const task = taskService.createTask({ title: 'Task' });

      await expect(storageService.saveTasks([task])).rejects.toThrow(
        'タスクの保存に失敗しました'
      );
    });

    it('should handle database load errors', async () => {
      vi.spyOn(mockClient, 'execute').mockRejectedValue(
        new Error('Database error')
      );

      await expect(storageService.loadTasks()).rejects.toThrow(
        'タスクの読み込みに失敗しました'
      );
    });
  });
});
