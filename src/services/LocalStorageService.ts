import type { Task } from '../types/task';

/**
 * LocalStorage保存時のデータ構造
 */
interface StorageData {
  version: string;
  tasks: Task[];
}

/**
 * LocalStorage操作に関するエラー
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

const STORAGE_KEY = 'matrixtask-data';
const STORAGE_VERSION = '1.0.0';

/**
 * LocalStorageへのデータ永続化を管理するサービス
 */
export class StorageService {
  /**
   * タスクをLocalStorageに保存する
   *
   * @param tasks - 保存するタスクリスト
   * @throws {StorageError} 保存に失敗した場合
   *
   * @example
   * ```typescript
   * const storage = new StorageService();
   * storage.saveTasks(tasks);
   * ```
   */
  saveTasks(tasks: Task[]): void {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        tasks,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      throw new StorageError('タスクの保存に失敗しました', error as Error);
    }
  }

  /**
   * LocalStorageからタスクを読み込む
   *
   * @returns 読み込んだタスクリスト
   * @throws {StorageError} 読み込みに失敗した場合
   *
   * @example
   * ```typescript
   * const storage = new StorageService();
   * const tasks = storage.loadTasks();
   * ```
   */
  loadTasks(): Task[] {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        return [];
      }

      const data: StorageData = JSON.parse(dataStr);

      // バージョンチェック（将来的なマイグレーション対応）
      if (data.version !== STORAGE_VERSION) {
        console.warn(
          `データバージョンが異なります: ${data.version} !== ${STORAGE_VERSION}`
        );
        // 将来的にマイグレーション処理を追加
      }

      // Date型の復元
      return data.tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      throw new StorageError('タスクの読み込みに失敗しました', error as Error);
    }
  }

  /**
   * LocalStorageのデータを削除する
   *
   * @example
   * ```typescript
   * const storage = new StorageService();
   * storage.clear();
   * ```
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
