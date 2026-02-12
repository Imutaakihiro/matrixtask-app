import type { Task, Quadrant, CreateTaskData } from '../types/task';
import { generateId } from '../utils/id';

/**
 * バリデーションエラー
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * タスクのCRUD操作とビジネスロジックを管理するサービス
 */
export class TaskService {
  /**
   * タスクを作成する
   *
   * @param data - 作成するタスクのデータ
   * @returns 作成されたタスク
   * @throws {ValidationError} データが不正な場合
   *
   * @example
   * ```typescript
   * const service = new TaskService();
   * const task = service.createTask({
   *   title: '新しいタスク',
   *   quadrant: 'important-urgent'
   * });
   * ```
   */
  createTask(data: CreateTaskData): Task {
    this.validateTitle(data.title);

    const now = new Date();

    return {
      id: generateId(),
      title: data.title,
      description: data.description,
      quadrant: data.quadrant ?? null,
      isPinnedToToday: false,
      dueDate: data.dueDate,
      tags: data.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * タスクを更新する
   *
   * @param task - 元のタスク
   * @param updates - 更新内容
   * @returns 更新されたタスク
   * @throws {ValidationError} データが不正な場合
   *
   * @example
   * ```typescript
   * const updated = service.updateTask(task, {
   *   title: '新しいタイトル'
   * });
   * ```
   */
  updateTask(task: Task, updates: Partial<Task>): Task {
    if (updates.title !== undefined) {
      this.validateTitle(updates.title);
    }

    return {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
  }

  /**
   * タスクを象限に移動する
   *
   * @param task - 移動するタスク
   * @param quadrant - 移動先の象限
   * @returns 更新されたタスク
   *
   * @example
   * ```typescript
   * const moved = service.moveTaskToQuadrant(task, 'important-urgent');
   * ```
   */
  moveTaskToQuadrant(task: Task, quadrant: Quadrant): Task {
    return {
      ...task,
      quadrant,
      updatedAt: new Date(),
    };
  }

  /**
   * タスクを「今日やること」にピン留めする
   *
   * @param task - ピン留めするタスク
   * @returns 更新されたタスク
   *
   * @example
   * ```typescript
   * const pinned = service.pinTaskToToday(task);
   * ```
   */
  pinTaskToToday(task: Task): Task {
    return {
      ...task,
      isPinnedToToday: true,
      updatedAt: new Date(),
    };
  }

  /**
   * タスクを「今日やること」から外す
   *
   * @param task - ピン留めを外すタスク
   * @returns 更新されたタスク
   *
   * @example
   * ```typescript
   * const unpinned = service.unpinTaskFromToday(task);
   * ```
   */
  unpinTaskFromToday(task: Task): Task {
    return {
      ...task,
      isPinnedToToday: false,
      updatedAt: new Date(),
    };
  }

  /**
   * タスクを完了する
   *
   * @param task - 完了するタスク
   * @returns 更新されたタスク
   *
   * @example
   * ```typescript
   * const completed = service.completeTask(task);
   * ```
   */
  completeTask(task: Task): Task {
    return {
      ...task,
      completedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * タスクのタイトルをバリデーションする
   *
   * @param title - タスクのタイトル
   * @throws {ValidationError} タイトルが不正な場合
   */
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('タスクのタイトルは必須です', 'title', title);
    }

    if (title.length > 200) {
      throw new ValidationError(
        'タスクのタイトルは200文字以内で入力してください',
        'title',
        title
      );
    }
  }
}
