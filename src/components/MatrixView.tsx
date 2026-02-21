import { QuadrantCard } from './QuadrantCard';
import type { Task, Quadrant } from '../types/task';

interface MatrixViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (quadrant: Quadrant, title: string) => void;
  onTaskComplete: (taskId: string) => void;
}

const quadrants: Quadrant[] = [
  'important-urgent',
  'important-not-urgent',
  'not-important-urgent',
  'not-important-not-urgent',
];

export function MatrixView({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
  onTaskComplete,
}: MatrixViewProps) {
  const getTasksForQuadrant = (quadrant: Quadrant): Task[] => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {quadrants.map((quadrant) => (
        <QuadrantCard
          key={quadrant}
          quadrant={quadrant}
          tasks={getTasksForQuadrant(quadrant)}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onTaskCreate={onTaskCreate}
          onTaskComplete={onTaskComplete}
        />
      ))}
    </div>
  );
}
