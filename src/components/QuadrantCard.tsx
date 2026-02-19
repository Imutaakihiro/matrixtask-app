import { TaskCard } from './TaskCard';
import type { Task, Quadrant } from '../types/task';
import { useDroppable } from '@dnd-kit/core';

interface QuadrantCardProps {
  quadrant: Quadrant;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const quadrantConfig: Record<Quadrant, { title: string }> = {
  'important-urgent': { title: 'Important · Urgent' },
  'important-not-urgent': { title: 'Important · Not Urgent' },
  'not-important-urgent': { title: 'Not Important · Urgent' },
  'not-important-not-urgent': { title: 'Not Important · Not Urgent' },
};

export function QuadrantCard({
  quadrant,
  tasks,
  onTaskUpdate,
  onTaskDelete,
}: QuadrantCardProps) {
  const config = quadrantConfig[quadrant];
  const { setNodeRef, isOver } = useDroppable({
    id: quadrant,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white border rounded p-4 min-h-[200px]
        ${isOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}
      `}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-medium text-gray-600">{config.title}</h3>
        <span className="text-xs text-gray-400">{tasks.length}</span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>
    </div>
  );
}
