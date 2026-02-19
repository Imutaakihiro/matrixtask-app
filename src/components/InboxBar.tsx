import { NaturalLanguageInput } from './NaturalLanguageInput';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';
import type { ParsedTask } from '../types/task';

interface InboxBarProps {
  tasks: Task[];
  onTaskCreate: (parsed: ParsedTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

export function InboxBar({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: InboxBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Inbox</h2>

      <NaturalLanguageInput onSubmit={onTaskCreate} />

      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-400 text-xs text-center py-4">Add a task</p>
        )}
      </div>
    </div>
  );
}
