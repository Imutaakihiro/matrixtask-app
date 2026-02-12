import type { Task } from '../types/task';
import { format } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';

interface TaskCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  isDragging?: boolean;
}

/**
 * タスクカードコンポーネント
 */
export function TaskCard({
  task,
  onTaskClick,
  onTaskUpdate,
  isDragging: isDraggingProp = false,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  // 編集モード開始時にinputにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // ダブルクリックで編集モード開始
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingTitle(task.title);
  };

  // 保存処理
  const handleSave = () => {
    const trimmedTitle = editingTitle.trim();
    if (trimmedTitle.length > 0 && trimmedTitle !== task.title) {
      onTaskUpdate(task.id, { title: trimmedTitle });
    } else if (trimmedTitle.length === 0) {
      setEditingTitle(task.title);
    }
    setIsEditing(false);
  };

  // キャンセル処理
  const handleCancel = () => {
    setEditingTitle(task.title);
    setIsEditing(false);
  };

  // キーボードイベントハンドリング
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!isEditing && listeners)}
      className={`
        bg-white rounded-lg shadow p-3
        transition-all duration-200
        hover:bg-gray-50 hover:shadow-md
        ${
          isEditing
            ? 'opacity-100 cursor-default'
            : isDragging || isDraggingProp
              ? 'opacity-50 cursor-grabbing'
              : 'opacity-100 cursor-grab'
        }
      `}
      onClick={() => !isEditing && onTaskClick(task.id)}
    >
      {/* タイトル */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="text-sm font-medium text-gray-900 mb-1 w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          maxLength={200}
        />
      ) : (
        <h4
          className="text-sm font-medium text-gray-900 mb-1"
          onDoubleClick={handleDoubleClick}
        >
          {task.title}
        </h4>
      )}

      {/* 期限 */}
      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-1">
          📅 {format(task.dueDate, 'yyyy-MM-dd')}
        </p>
      )}

      {/* タグ */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
