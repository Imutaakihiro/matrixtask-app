import { create } from 'zustand';
import type { AppState } from '../types/store';
import type { Task, Quadrant, CreateTaskData } from '../types/task';
import { TaskService } from '../services/TaskService';
import { StorageService } from '../services/StorageService';
import { MigrationService } from '../services/MigrationService';

const taskService = new TaskService();
const storageService = new StorageService();

/**
 * タスク管理のZustandストア (Turso対応・非同期版)
 */
export const useTaskStore = create<AppState>((set, get) => ({
  // --- State ---
  tasks: [],
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * ストアを初期化する
   * - LocalStorageからTursoへの移行を実行
   * - Tursoからタスクをロード
   */
  init: async () => {
    set({ isLoading: true, error: null });

    try {
      // LocalStorageからTursoへの移行（初回のみ）
      await MigrationService.migrateIfNeeded();

      // Tursoからタスクをロード
      const tasks = await storageService.loadTasks();

      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize task store:', error);
      set({
        error: error as Error,
        isLoading: false,
      });
    }
  },

  createTask: async (data: CreateTaskData) => {
    const newTask = taskService.createTask(data);

    // 楽観的更新: UIを即座に更新
    set((state) => ({ tasks: [...state.tasks, newTask] }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to save task:', error);

      // エラー時: ロールバック
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== newTask.id),
        error: error as Error,
      }));
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    // 元のタスクを保存（ロールバック用）
    const oldTask = get().tasks.find((t) => t.id === taskId);

    // 楽観的更新
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? taskService.updateTask(task, updates) : task
      ),
    }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to update task:', error);

      // エラー時: ロールバック
      if (oldTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? oldTask : t)),
          error: error as Error,
        }));
      }
    }
  },

  deleteTask: async (taskId: string) => {
    // 元のタスクを保存（ロールバック用）
    const oldTask = get().tasks.find((t) => t.id === taskId);

    // 楽観的更新
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to delete task:', error);

      // エラー時: ロールバック
      if (oldTask) {
        set((state) => ({
          tasks: [...state.tasks, oldTask],
          error: error as Error,
        }));
      }
    }
  },

  moveTaskToQuadrant: async (taskId: string, quadrant: Quadrant) => {
    // 元のタスクを保存（ロールバック用）
    const oldTask = get().tasks.find((t) => t.id === taskId);

    // 楽観的更新
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? taskService.moveTaskToQuadrant(task, quadrant)
          : task
      ),
    }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to move task:', error);

      // エラー時: ロールバック
      if (oldTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? oldTask : t)),
          error: error as Error,
        }));
      }
    }
  },

  pinTaskToToday: async (taskId: string) => {
    // 元のタスクを保存（ロールバック用）
    const oldTask = get().tasks.find((t) => t.id === taskId);

    // 楽観的更新
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? taskService.pinTaskToToday(task) : task
      ),
    }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to pin task:', error);

      // エラー時: ロールバック
      if (oldTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? oldTask : t)),
          error: error as Error,
        }));
      }
    }
  },

  unpinTaskFromToday: async (taskId: string) => {
    // 元のタスクを保存（ロールバック用）
    const oldTask = get().tasks.find((t) => t.id === taskId);

    // 楽観的更新
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? taskService.unpinTaskFromToday(task) : task
      ),
    }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to unpin task:', error);

      // エラー時: ロールバック
      if (oldTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? oldTask : t)),
          error: error as Error,
        }));
      }
    }
  },

  completeTask: async (taskId: string) => {
    // 元のタスクを保存（ロールバック用）
    const oldTask = get().tasks.find((t) => t.id === taskId);

    // 楽観的更新
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? taskService.completeTask(task) : task
      ),
    }));

    try {
      // Tursoに保存
      await storageService.saveTasks(get().tasks);
    } catch (error) {
      console.error('Failed to complete task:', error);

      // エラー時: ロールバック
      if (oldTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? oldTask : t)),
          error: error as Error,
        }));
      }
    }
  },
}));
