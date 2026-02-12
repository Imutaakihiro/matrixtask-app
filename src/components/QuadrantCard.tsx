import { TaskCard } from './TaskCard';
import type { Task, Quadrant } from '../types/task';
import { useDroppable } from '@dnd-kit/core';

interface QuadrantCardProps {
  quadrant: Quadrant;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const quadrantConfig: Record<
  Quadrant,
  { title: string; bgColor: string; textColor: string }
> = {
  'important-urgent': {
    title: '重要×緊急',
    bgColor: 'bg-red-50',
    textColor: 'text-red-900',
  },
  'important-not-urgent': {
    title: '重要×緊急でない',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
  },
  'not-important-urgent': {
    title: '重要でない×緊急',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-900',
  },
  'not-important-not-urgent': {
    title: '重要でない×緊急でない',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-900',
  },
};

export function QuadrantCard({
  quadrant,
  tasks,
  onTaskClick,
  onTaskUpdate,
}: QuadrantCardProps) {
  const config = quadrantConfig[quadrant];
  const { setNodeRef, isOver } = useDroppable({
    id: quadrant,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        ${config.bgColor} rounded-lg shadow p-4 min-h-[200px]
        transition-all duration-200
        ${isOver ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50' : ''}
      `}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-sm font-semibold ${config.textColor}`}>
          {config.title}
        </h3>
        <span className={`text-xs ${config.textColor} opacity-70`}>
          ({tasks.length})
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            onTaskUpdate={onTaskUpdate}
          />
        ))}
      </div>
    </div>
  );
}
