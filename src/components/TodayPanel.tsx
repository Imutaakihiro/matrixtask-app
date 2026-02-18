import type { Task } from '../types/task';
import { useDroppable } from '@dnd-kit/core';

interface TodayPanelProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export function TodayPanel({
  tasks,
  onTaskComplete,
  onTaskClick,
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

      <div className="space-y-2">
        {pinnedTasks.map((task) => (
          <div key={task.id} className="flex items-start gap-2 py-2">
            <input
              type="checkbox"
              className="mt-1 cursor-pointer"
              onChange={() => onTaskComplete(task.id)}
            />
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onTaskClick(task.id)}
            >
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
