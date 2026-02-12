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
        bg-white rounded-lg shadow p-4 sticky top-6
        transition-all duration-200
        ${isOver ? 'ring-2 ring-green-400 ring-offset-2 bg-green-50' : ''}
      `}
    >
      <h2 className="text-lg font-semibold mb-4">今日やること</h2>

      <div className="space-y-2">
        {pinnedTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-2 p-2 rounded hover:bg-gray-50"
          >
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
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-800 px-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {pinnedTasks.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            ピン留めされたタスクがありません
          </p>
        )}
      </div>
    </div>
  );
}
