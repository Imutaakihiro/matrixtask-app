import { useEffect, useState } from 'react';
import type { Task } from '../types/task';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onTaskUpdate,
  onTaskDelete,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onTaskUpdate(task.id, { title, description });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('このタスクを削除しますか？')) {
      onTaskDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">タスク詳細</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              onClick={handleDelete}
            >
              削除
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={onClose}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                onClick={handleSave}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
