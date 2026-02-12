import { NaturalLanguageInput } from './NaturalLanguageInput';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';
import type { ParsedTask } from '../types/task';

interface InboxBarProps {
  tasks: Task[];
  onTaskCreate: (parsed: ParsedTask) => void;
  onTaskClick: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function InboxBar({
  tasks,
  onTaskCreate,
  onTaskClick,
  onTaskUpdate,
}: InboxBarProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">受信箱</h2>

      <NaturalLanguageInput onSubmit={onTaskCreate} />

      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            onTaskUpdate={onTaskUpdate}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            タスクを追加してください
          </p>
        )}
      </div>
    </div>
  );
}
