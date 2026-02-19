import { useCallback, useEffect, useState } from 'react';
import type { Task } from './types/task';
import { useTaskStore } from './stores/taskStore';
import { InboxBar } from './components/InboxBar';
import { MatrixView } from './components/MatrixView';
import { TodayPanel } from './components/TodayPanel';
import { TaskCard } from './components/TaskCard';
import type { ParsedTask } from './types/task';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { isQuadrant } from './utils/dnd';

function App() {
  const {
    tasks,
    isLoading,
    error,
    init,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    moveTaskToQuadrant,
    pinTaskToToday,
  } = useTaskStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  // DragOverlay用のnoop（ドラッグ中はインタラクション不要）
  const noopUpdate = useCallback(
    (_taskId: string, _updates: Partial<Task>) => {},
    []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Tursoからデータをロード（初回のみ）
  useEffect(() => {
    init();
  }, [init]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const taskId = active.id as string;
    const dropZoneId = over.id as string;

    try {
      if (dropZoneId === 'today') {
        pinTaskToToday(taskId);
      } else if (isQuadrant(dropZoneId)) {
        moveTaskToQuadrant(taskId, dropZoneId);
      }
    } catch (error) {
      console.error('Drag and drop failed:', error);
    } finally {
      setActiveId(null);
    }
  };

  // 受信箱のタスク（quadrant === null）
  const inboxTasks = tasks.filter(
    (task) => task.quadrant === null && !task.completedAt
  );

  // マトリクスのタスク（quadrant !== null かつ今日パネル未ピン留め かつ未完了）
  const matrixTasks = tasks.filter(
    (task) =>
      task.quadrant !== null && !task.isPinnedToToday && !task.completedAt
  );

  const handleTaskCreate = (parsed: ParsedTask) => {
    createTask({
      title: parsed.title,
      dueDate: parsed.dueDate,
      tags: parsed.tags,
    });
  };

  // ドラッグ中のタスクを取得
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md p-6 border border-gray-200 rounded">
          <p className="text-sm text-gray-900 mb-4">{error.message}</p>
          <button
            onClick={() => init()}
            className="text-sm text-gray-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">
              MatrixTask
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Center: Inbox + Matrix (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Inbox */}
              <InboxBar
                tasks={inboxTasks}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={updateTask}
                onTaskDelete={deleteTask}
              />

              {/* Matrix */}
              <MatrixView
                tasks={matrixTasks}
                onTaskUpdate={updateTask}
                onTaskDelete={deleteTask}
              />
            </div>

            {/* Right: Today Panel (1 column) */}
            <div className="lg:col-span-1">
              <TodayPanel
                tasks={tasks}
                onTaskComplete={completeTask}
                onTaskUpdate={updateTask}
                onTaskDelete={deleteTask}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onTaskUpdate={noopUpdate}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
