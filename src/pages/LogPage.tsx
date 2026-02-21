import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Task } from '../types/task';

const quadrantLabel: Record<string, string> = {
  'important-urgent': 'Important · Urgent',
  'important-not-urgent': 'Important · Not Urgent',
  'not-important-urgent': 'Not Important · Urgent',
  'not-important-not-urgent': 'Not Important · Not Urgent',
};

interface LogPageProps {
  tasks: Task[];
  onRestore: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onBack: () => void;
}

export function LogPage({ tasks, onRestore, onDelete, onBack }: LogPageProps) {
  const completedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.completedAt)
        .sort(
          (a, b) =>
            new Date(b.completedAt!).getTime() -
            new Date(a.completedAt!).getTime()
        ),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-500">
            Completed ({completedTasks.length})
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {completedTasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">
            No completed tasks
          </p>
        ) : (
          <ul className="space-y-2">
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="border border-gray-100 rounded p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 line-through">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(task.completedAt!), 'yyyy-MM-dd HH:mm')}
                    {task.quadrant && (
                      <span className="ml-2">
                        · {quadrantLabel[task.quadrant]}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRestore(task.id)}
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this task permanently?')) {
                        onDelete(task.id);
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
