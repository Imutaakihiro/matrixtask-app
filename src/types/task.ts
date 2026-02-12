/**
 * タスクの象限を表す型
 *
 * - important-urgent: 重要×緊急（第1象限）
 * - important-not-urgent: 重要×緊急でない（第2象限）
 * - not-important-urgent: 重要でない×緊急（第3象限）
 * - not-important-not-urgent: 重要でない×緊急でない（第4象限）
 */
export type Quadrant =
  | 'important-urgent'
  | 'important-not-urgent'
  | 'not-important-urgent'
  | 'not-important-not-urgent';

/**
 * タスクのインターフェース
 */
export interface Task {
  /** UUID v4形式のタスクID */
  id: string;

  /** タスク名（1-200文字） */
  title: string;

  /** タスクの説明（オプション） */
  description?: string;

  /** 所属する象限（受信箱の場合null） */
  quadrant: Quadrant | null;

  /** 「今日やること」にピン留めされているか */
  isPinnedToToday: boolean;

  /** 期限 */
  dueDate?: Date;

  /** タグリスト */
  tags: string[];

  /** 作成日時 */
  createdAt: Date;

  /** 更新日時 */
  updatedAt: Date;

  /** 完了日時 */
  completedAt?: Date;
}

/**
 * 自然言語入力のパース結果
 */
export interface ParsedTask {
  /** パース後のタスク名 */
  title: string;

  /** 抽出された期限 */
  dueDate?: Date;

  /** 抽出されたタグ */
  tags: string[];
}

/**
 * タスク作成時のデータ
 */
export interface CreateTaskData {
  /** タスク名 */
  title: string;

  /** タスクの説明（オプション） */
  description?: string;

  /** 期限（オプション） */
  dueDate?: Date;

  /** タグ（オプション） */
  tags?: string[];

  /** 象限（オプション、デフォルトはnull=受信箱） */
  quadrant?: Quadrant | null;
}
