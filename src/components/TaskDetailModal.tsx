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
    if (confirm('Delete this task?')) {
      onTaskDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded max-w-lg w-full mx-4 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Title</label>
            <input
              type="text"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Notes</label>
            <textarea
              className="w-full px-0 py-1 border-0 border-b border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-400 resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-red-500"
              onClick={handleDelete}
            >
              Delete
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="text-xs text-gray-900 hover:text-gray-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
