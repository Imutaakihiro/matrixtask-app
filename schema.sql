-- MatrixTask データベーススキーマ
-- Turso (SQLite) 用

-- tasksテーブル
-- タスクデータを保存
CREATE TABLE IF NOT EXISTS tasks (
  -- タスクID (UUID v4形式)
  id TEXT PRIMARY KEY,

  -- タスクタイトル (必須、1-200文字)
  title TEXT NOT NULL,

  -- タスク説明 (オプション、プレーンテキスト)
  description TEXT,

  -- 所属する象限 (NULL=受信箱, 'important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent')
  quadrant TEXT,

  -- 「今日やること」にピン留めされているか (0=false, 1=true)
  is_pinned_to_today INTEGER NOT NULL DEFAULT 0,

  -- 期限 (ISO 8601形式の文字列、例: '2026-02-12T00:00:00.000Z')
  due_date TEXT,

  -- タグリスト (JSON配列形式の文字列、例: '["重要","緊急"]')
  tags TEXT NOT NULL DEFAULT '[]',

  -- 作成日時 (ISO 8601形式の文字列)
  created_at TEXT NOT NULL,

  -- 更新日時 (ISO 8601形式の文字列)
  updated_at TEXT NOT NULL,

  -- 完了日時 (ISO 8601形式の文字列、未完了の場合はNULL)
  completed_at TEXT
);

-- インデックス作成（クエリパフォーマンス向上のため）

-- 象限でのフィルタリングを高速化
CREATE INDEX IF NOT EXISTS idx_quadrant ON tasks(quadrant);

-- 「今日やること」のフィルタリングを高速化
CREATE INDEX IF NOT EXISTS idx_is_pinned_to_today ON tasks(is_pinned_to_today);

-- 期限でのソート・フィルタリングを高速化
CREATE INDEX IF NOT EXISTS idx_due_date ON tasks(due_date);

-- 完了タスクのフィルタリングを高速化
CREATE INDEX IF NOT EXISTS idx_completed_at ON tasks(completed_at);
