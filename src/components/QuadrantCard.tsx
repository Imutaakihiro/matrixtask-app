import { useState } from 'react';
import { TaskCard } from './TaskCard';
import type { Task, Quadrant } from '../types/task';
import { useDroppable } from '@dnd-kit/core';

interface QuadrantCardProps {
  quadrant: Quadrant;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (quadrant: Quadrant, title: string) => void;
  onTaskComplete: (taskId: string) => void;
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
  onTaskCreate,
  onTaskComplete,
}: QuadrantCardProps) {
  const config = quadrantConfig[quadrant];
  const { setNodeRef, isOver } = useDroppable({
    id: quadrant,
  });
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onTaskCreate(quadrant, input.trim());
      setInput('');
    }
    if (e.key === 'Escape') {
      setInput('');
      e.currentTarget.blur();
    }
  };

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
            onTaskComplete={onTaskComplete}
          />
        ))}
      </div>

      <div className="mt-3">
        <input
          type="text"
          className="w-full px-0 py-1 border-0 border-b border-gray-200 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-400"
          placeholder="Add task..."
          value={input}
          maxLength={200}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
