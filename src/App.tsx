import { useEffect, useState } from 'react';
import { useTaskStore } from './stores/taskStore';
import { InboxBar } from './components/InboxBar';
import { MatrixView } from './components/MatrixView';
import { TodayPanel } from './components/TodayPanel';
import { TaskDetailModal } from './components/TaskDetailModal';
import { TaskCard } from './components/TaskCard';
import type { ParsedTask } from './types/task';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
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
    isTaskModalOpen,
    selectedTaskId,
    openTaskModal,
    closeTaskModal,
  } = useTaskStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Tursoからデータをロード（初回のみ）
  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: 将来的にタスク追加モーダルを開く
        console.log('Ctrl+K pressed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // ドロップ先がない場合は何もしない
    if (!over) {
      setActiveId(null);
      return;
    }

    const taskId = active.id as string;
    const dropZoneId = over.id as string;

    try {
      if (dropZoneId === 'today') {
        // 今日やることパネルにドロップ
        pinTaskToToday(taskId);
      } else if (isQuadrant(dropZoneId)) {
        // マトリクスの象限にドロップ
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

  // マトリクスのタスク（quadrant !== null）
  const matrixTasks = tasks.filter((task) => task.quadrant !== null);

  // 選択されたタスク
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            エラーが発生しました
          </h2>
          <p className="text-gray-700 mb-4">{error.message}</p>
          <button
            onClick={() => init()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">MatrixTask</h1>
            <p className="text-sm text-gray-500">
              アイゼンハワーマトリクスによる行動指向Todoアプリ
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Center: Inbox + Matrix (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Inbox */}
              <InboxBar
                tasks={inboxTasks}
                onTaskCreate={handleTaskCreate}
                onTaskClick={openTaskModal}
                onTaskUpdate={updateTask}
              />

              {/* Matrix */}
              <MatrixView
                tasks={matrixTasks}
                onTaskClick={openTaskModal}
                onTaskUpdate={updateTask}
              />
            </div>

            {/* Right: Today Panel (1 column) */}
            <div className="lg:col-span-1">
              <TodayPanel
                tasks={tasks}
                onTaskComplete={completeTask}
                onTaskClick={openTaskModal}
              />
            </div>
          </div>
        </div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          onTaskUpdate={updateTask}
          onTaskDelete={deleteTask}
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onTaskClick={() => {}}
            onTaskUpdate={updateTask}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
