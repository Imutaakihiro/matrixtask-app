import type { Task, Quadrant } from '../types/task';
import { TursoClient } from './TursoClient';
import type { Client } from '@libsql/client';

/**
 * ストレージ操作に関するエラー
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Tursoデータベースへのデータ永続化を管理するサービス
 */
export class StorageService {
  private client: Client;

  constructor() {
    this.client = TursoClient.getClient();
  }

  /**
   * タスクをTursoデータベースに保存する
   *
   * @param tasks - 保存するタスクリスト
   * @throws {StorageError} 保存に失敗した場合
   *
   * @example
   * ```typescript
   * const storage = new StorageService();
   * await storage.saveTasks(tasks);
   * ```
   */
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      // バッチ処理で一括保存（トランザクション）
      const batch = tasks.map((task) => ({
        sql: `INSERT OR REPLACE INTO tasks (
          id, title, description, quadrant, is_pinned_to_today,
          due_date, tags, created_at, updated_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          task.id,
          task.title,
          task.description || null,
          task.quadrant,
          task.isPinnedToToday ? 1 : 0,
          task.dueDate?.toISOString() || null,
          JSON.stringify(task.tags),
          task.createdAt.toISOString(),
          task.updatedAt.toISOString(),
          task.completedAt?.toISOString() || null,
        ],
      }));

      await this.client.batch(batch, 'write');
    } catch (error) {
      throw new StorageError('タスクの保存に失敗しました', error as Error);
    }
  }

  /**
   * Tursoデータベースからタスクを読み込む
   *
   * @returns 読み込んだタスクリスト
   * @throws {StorageError} 読み込みに失敗した場合
   *
   * @example
   * ```typescript
   * const storage = new StorageService();
   * const tasks = await storage.loadTasks();
   * ```
   */
  async loadTasks(): Promise<Task[]> {
    try {
      const result = await this.client.execute('SELECT * FROM tasks');

      return result.rows.map((row) => this.rowToTask(row));
    } catch (error) {
      throw new StorageError('タスクの読み込みに失敗しました', error as Error);
    }
  }

  /**
   * Tursoデータベースのデータを削除する
   *
   * @example
   * ```typescript
   * const storage = new StorageService();
   * await storage.clear();
   * ```
   */
  async clear(): Promise<void> {
    try {
      await this.client.execute('DELETE FROM tasks');
    } catch (error) {
      throw new StorageError('タスクの削除に失敗しました', error as Error);
    }
  }

  /**
   * データベースの行をTask型に変換する
   *
   * @private
   * @param row - データベースの行
   * @returns Task型のオブジェクト
   */
  private rowToTask(row: any): Task {
    return {
      id: row.id as string,
      title: row.title as string,
      description: row.description as string | undefined,
      quadrant: row.quadrant as Quadrant | null,
      isPinnedToToday: row.is_pinned_to_today === 1,
      dueDate: row.due_date ? new Date(row.due_date as string) : undefined,
      tags: JSON.parse(row.tags as string) as string[],
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
      completedAt: row.completed_at
        ? new Date(row.completed_at as string)
        : undefined,
    };
  }
}
