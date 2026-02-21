import type { Task } from '../types/task';
import { format } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskComplete?: (taskId: string) => void;
  isDragging?: boolean;
}

/**
 * タスクカードコンポーネント
 * クリックでインライン展開編集が可能
 */
export function TaskCard({
  task,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  isDragging: isDraggingProp = false,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(task.title);
  const [editingDescription, setEditingDescription] = useState(
    task.description || ''
  );
  const titleRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      disabled: isExpanded,
    });

  // 展開時にタイトル入力にフォーカス
  useEffect(() => {
    if (isExpanded && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [isExpanded]);

  // taskが外部から変更された場合に編集内容をリセット
  useEffect(() => {
    if (!isExpanded) {
      setEditingTitle(task.title);
      setEditingDescription(task.description || '');
    }
  }, [task.title, task.description, isExpanded]);

  const handleOpen = () => {
    setEditingTitle(task.title);
    setEditingDescription(task.description || '');
    setIsExpanded(true);
  };

  const handleSave = () => {
    const trimmedTitle = editingTitle.trim();
    if (trimmedTitle.length === 0) return;

    onTaskUpdate(task.id, {
      title: trimmedTitle,
      description: editingDescription.trim(),
    });
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setEditingTitle(task.title);
    setEditingDescription(task.description || '');
    setIsExpanded(false);
  };

  const handleDelete = () => {
    if (onTaskDelete && confirm('Delete this task?')) {
      onTaskDelete(task.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const style =
    transform && !isDragging
      ? {
          transform: CSS.Translate.toString(transform),
        }
      : undefined;

  if (isExpanded) {
    return (
      <div
        ref={setNodeRef}
        className="bg-white border border-blue-300 rounded p-3 shadow-sm"
        onKeyDown={handleKeyDown}
      >
        <input
          ref={titleRef}
          type="text"
          className="w-full text-sm font-medium text-gray-900 border-0 border-b border-gray-300 pb-1 mb-2 focus:outline-none focus:border-blue-400"
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          maxLength={200}
          placeholder="Task title"
        />
        <textarea
          className="w-full text-sm text-gray-600 border-0 border-b border-gray-200 pb-1 mb-3 focus:outline-none focus:border-blue-400 resize-none"
          rows={2}
          value={editingDescription}
          onChange={(e) => setEditingDescription(e.target.value)}
          placeholder="Notes..."
        />
        <div className="flex justify-between items-center">
          {onTaskDelete ? (
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-4">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="text-xs text-gray-900 hover:text-gray-600 transition-colors font-medium"
              onClick={handleSave}
              disabled={!editingTitle.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border border-gray-200 rounded p-3 flex items-start gap-2
        ${isDragging || isDraggingProp ? '' : 'transition-colors duration-150'}
        hover:bg-gray-50 cursor-grab
        ${isDragging || isDraggingProp ? 'opacity-40 cursor-grabbing' : 'opacity-100'}
      `}
      onClick={handleOpen}
    >
      {onTaskComplete && (
        <input
          type="checkbox"
          className="mt-0.5 shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onTaskComplete(task.id);
          }}
          onChange={() => {}}
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>

        {task.description && (
          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <p className="text-xs text-gray-500 mt-1">
            {format(task.dueDate, 'yyyy-MM-dd')}
          </p>
        )}

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
