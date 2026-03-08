import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Task, Quadrant } from './types/task';
import { useTaskStore } from './stores/taskStore';
import { MatrixView } from './components/MatrixView';
import { TaskCard } from './components/TaskCard';
import { LogPage } from './pages/LogPage';
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

type Page = 'matrix' | 'log';

const QUADRANT_ORDER: Quadrant[] = [
  'important-urgent',
  'important-not-urgent',
  'not-important-urgent',
  'not-important-not-urgent',
];

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
    uncompleteTask,
    moveTaskToQuadrant,
  } = useTaskStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('matrix');
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

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
      if (isQuadrant(dropZoneId)) {
        moveTaskToQuadrant(taskId, dropZoneId);
      }
    } catch (error) {
      console.error('Drag and drop failed:', error);
    } finally {
      setActiveId(null);
    }
  };

  // マトリクスのタスク（未完了のもの全て）
  const matrixTasks = tasks.filter((task) => !task.completedAt);

  // キーボードナビゲーション用: 象限順にフラット化したタスクリスト
  const orderedTasks = useMemo(
    () =>
      QUADRANT_ORDER.flatMap((q) =>
        matrixTasks.filter((t) => t.quadrant === q)
      ),
    [matrixTasks]
  );

  // グローバルキーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setFocusedTaskId((current) => {
          if (orderedTasks.length === 0) return current;
          if (current === null) return orderedTasks[0].id;
          const idx = orderedTasks.findIndex((t) => t.id === current);
          return orderedTasks[Math.min(idx + 1, orderedTasks.length - 1)].id;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setFocusedTaskId((current) => {
          if (orderedTasks.length === 0) return current;
          if (current === null) return orderedTasks[0].id;
          const idx = orderedTasks.findIndex((t) => t.id === current);
          if (idx <= 0) return orderedTasks[0].id;
          return orderedTasks[idx - 1].id;
        });
      } else if (e.key === 'Escape') {
        setFocusedTaskId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderedTasks]);

  // フォーカスタスクへ自動スクロール
  useEffect(() => {
    if (!focusedTaskId) return;
    document
      .querySelector(`[data-task-id="${focusedTaskId}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusedTaskId]);

  const handleTaskCreate = useCallback(
    (quadrant: Quadrant, title: string) => {
      createTask({ title, quadrant });
    },
    [createTask]
  );

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

  // Logページ
  if (page === 'log') {
    return (
      <LogPage
        tasks={tasks}
        onRestore={uncompleteTask}
        onDelete={deleteTask}
        onBack={() => setPage('matrix')}
      />
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
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">
              MatrixTask
            </h1>
            <button
              type="button"
              onClick={() => setPage('log')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Log
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <MatrixView
            tasks={matrixTasks}
            onTaskUpdate={updateTask}
            onTaskDelete={deleteTask}
            onTaskCreate={handleTaskCreate}
            onTaskComplete={completeTask}
            focusedTaskId={focusedTaskId}
            onTaskFocus={setFocusedTaskId}
          />
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
