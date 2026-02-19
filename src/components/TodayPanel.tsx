import { useState, useRef, useEffect } from 'react';
import type { Task } from '../types/task';
import { useDroppable } from '@dnd-kit/core';

interface TodayPanelProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

interface TodayTaskItemProps {
  task: Task;
  onComplete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

function TodayTaskItem({
  task,
  onComplete,
  onUpdate,
  onDelete,
}: TodayTaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(task.title);
  const [editingDescription, setEditingDescription] = useState(
    task.description || ''
  );
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [isExpanded]);

  const handleOpen = () => {
    setEditingTitle(task.title);
    setEditingDescription(task.description || '');
    setIsExpanded(true);
  };

  const handleSave = () => {
    const trimmedTitle = editingTitle.trim();
    if (trimmedTitle.length === 0) return;
    onUpdate({ title: trimmedTitle, description: editingDescription.trim() });
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setEditingTitle(task.title);
    setEditingDescription(task.description || '');
    setIsExpanded(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      onDelete();
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

  if (isExpanded) {
    return (
      <div
        className="py-2 border-b border-gray-100 last:border-0"
        onKeyDown={handleKeyDown}
      >
        <input
          ref={titleRef}
          type="text"
          className="w-full text-sm font-medium text-gray-900 border-0 border-b border-gray-300 pb-1 mb-2 focus:outline-none focus:border-blue-400"
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          maxLength={200}
        />
        <textarea
          className="w-full text-sm text-gray-600 border-0 border-b border-gray-200 pb-1 mb-2 focus:outline-none focus:border-blue-400 resize-none"
          rows={2}
          value={editingDescription}
          onChange={(e) => setEditingDescription(e.target.value)}
          placeholder="Notes..."
        />
        <div className="flex justify-between items-center mt-1">
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            onClick={handleDelete}
          >
            Delete
          </button>
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
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
      <input
        type="checkbox"
        className="mt-1 cursor-pointer"
        onChange={onComplete}
      />
      <div className="flex-1 cursor-pointer" onClick={handleOpen}>
        <p className="text-sm font-medium text-gray-900">{task.title}</p>
        {task.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
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

export function TodayPanel({
  tasks,
  onTaskComplete,
  onTaskUpdate,
  onTaskDelete,
}: TodayPanelProps) {
  const pinnedTasks = tasks.filter(
    (task) => task.isPinnedToToday && !task.completedAt
  );

  const { setNodeRef, isOver } = useDroppable({
    id: 'today',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white border rounded p-4 sticky top-6
        ${isOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}
      `}
    >
      <h2 className="text-sm font-medium text-gray-700 mb-3">Today</h2>

      <div>
        {pinnedTasks.map((task) => (
          <TodayTaskItem
            key={task.id}
            task={task}
            onComplete={() => onTaskComplete(task.id)}
            onUpdate={(updates) => onTaskUpdate(task.id, updates)}
            onDelete={() => onTaskDelete(task.id)}
          />
        ))}

        {pinnedTasks.length === 0 && (
          <p className="text-gray-400 text-xs text-center py-4">
            Drag tasks here
          </p>
        )}
      </div>
    </div>
  );
}
