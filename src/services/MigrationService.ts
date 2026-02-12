import { StorageService } from './StorageService';
import type { Task } from '../types/task';

/**
 * データ移行に関するエラー
 */
export class MigrationError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'MigrationError';
  }
}

/**
 * LocalStorageからTursoへのデータ移行を管理するサービス
 */
export class MigrationService {
  private static readonly MIGRATION_FLAG = 'matrixtask-migrated-to-turso';
  private static readonly LOCALSTORAGE_KEY = 'matrixtask-data';

  /**
   * 必要に応じてLocalStorageからTursoへデータを移行する
   *
   * - 既に移行済みの場合は何もしない
   * - LocalStorageにデータがない場合はフラグのみ立てる
   * - データがある場合はTursoに保存し、LocalStorageをクリアする
   *
   * @throws {MigrationError} 移行に失敗した場合
   *
   * @example
   * ```typescript
   * await MigrationService.migrateIfNeeded();
   * ```
   */
  static async migrateIfNeeded(): Promise<void> {
    try {
      // 移行済みフラグをチェック
      const migrated = localStorage.getItem(this.MIGRATION_FLAG);
      if (migrated === 'true') {
        console.log(
          '[Migration] Already migrated to Turso, skipping migration'
        );
        return;
      }

      console.log('[Migration] Checking LocalStorage for data to migrate...');

      // LocalStorageからデータを読み込む
      const tasks = this.loadTasksFromLocalStorage();

      if (tasks.length === 0) {
        console.log('[Migration] No data in LocalStorage, marking as migrated');
        localStorage.setItem(this.MIGRATION_FLAG, 'true');
        return;
      }

      console.log(
        `[Migration] Found ${tasks.length} tasks in LocalStorage, migrating to Turso...`
      );

      // Tursoに保存
      const tursoService = new StorageService();
      await tursoService.saveTasks(tasks);

      console.log('[Migration] Successfully saved tasks to Turso');

      // LocalStorageをクリア
      localStorage.removeItem(this.LOCALSTORAGE_KEY);

      // 移行完了フラグを立てる
      localStorage.setItem(this.MIGRATION_FLAG, 'true');

      console.log(
        `[Migration] Completed migration of ${tasks.length} tasks from LocalStorage to Turso`
      );
    } catch (error) {
      console.error('[Migration] Failed to migrate data:', error);
      throw new MigrationError(
        'LocalStorageからTursoへのデータ移行に失敗しました。',
        error as Error
      );
    }
  }

  /**
   * LocalStorageからタスクを読み込む（旧形式）
   *
   * @private
   * @returns タスクリスト
   */
  private static loadTasksFromLocalStorage(): Task[] {
    try {
      const dataStr = localStorage.getItem(this.LOCALSTORAGE_KEY);
      if (!dataStr) {
        return [];
      }

      const data = JSON.parse(dataStr);

      // tasks配列を取得（旧形式のStorageDataに対応）
      const tasks = data.tasks || [];

      // Date型の復元
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error(
        '[Migration] Failed to load tasks from LocalStorage:',
        error
      );
      return [];
    }
  }

  /**
   * 移行フラグをリセットする（テスト用）
   *
   * @internal
   */
  static resetMigrationFlag(): void {
    localStorage.removeItem(this.MIGRATION_FLAG);
  }
}
