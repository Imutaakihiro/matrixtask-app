import type { Task, Quadrant, CreateTaskData } from './task';

/**
 * アプリケーション全体の状態 (Turso対応・非同期版)
 */
export interface AppState {
  /** 全タスクリスト */
  tasks: Task[];

  /** ローディング状態 */
  isLoading: boolean;

  /** エラー状態 */
  error: Error | null;

  /** タスク詳細モーダルの表示状態 */
  isTaskModalOpen: boolean;

  /** 選択中のタスクID */
  selectedTaskId: string | null;

  // --- Actions ---

  /** ストアを初期化する（Tursoからデータをロード） */
  init: () => Promise<void>;

  /** タスクを作成する */
  createTask: (data: CreateTaskData) => Promise<void>;

  /** タスクを更新する */
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;

  /** タスクを削除する */
  deleteTask: (taskId: string) => Promise<void>;

  /** タスクを象限に移動する */
  moveTaskToQuadrant: (taskId: string, quadrant: Quadrant) => Promise<void>;

  /** タスクを「今日やること」にピン留めする */
  pinTaskToToday: (taskId: string) => Promise<void>;

  /** タスクを「今日やること」から外す */
  unpinTaskFromToday: (taskId: string) => Promise<void>;

  /** タスクを完了する */
  completeTask: (taskId: string) => Promise<void>;

  /** タスク詳細モーダルを開く */
  openTaskModal: (taskId: string) => void;

  /** タスク詳細モーダルを閉じる */
  closeTaskModal: () => void;
}
