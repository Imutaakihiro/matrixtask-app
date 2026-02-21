import { describe, it, expect, beforeEach } from 'vitest';
import { TaskService } from '../../../src/services/TaskService';
import type { Task } from '../../../src/types/task';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  describe('createTask', () => {
    it('should create a task with required fields', () => {
      const task = taskService.createTask({ title: 'Test Task' });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.quadrant).toBeNull();
      expect(task.isPinnedToToday).toBe(false);
      expect(task.tags).toEqual([]);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(task.completedAt).toBeUndefined();
    });

    it('should create a task with optional fields', () => {
      const dueDate = new Date('2026-12-31');
      const task = taskService.createTask({
        title: 'Test Task',
        dueDate,
        tags: ['work', 'urgent'],
      });

      expect(task.title).toBe('Test Task');
      expect(task.dueDate).toEqual(dueDate);
      expect(task.tags).toEqual(['work', 'urgent']);
    });

    it('should throw ValidationError for empty title', () => {
      expect(() => taskService.createTask({ title: '' })).toThrow(
        'タスクのタイトルは必須です'
      );
    });

    it('should throw ValidationError for whitespace-only title', () => {
      expect(() => taskService.createTask({ title: '   ' })).toThrow(
        'タスクのタイトルは必須です'
      );
    });
  });

  describe('updateTask', () => {
    let task: Task;

    beforeEach(() => {
      task = taskService.createTask({ title: 'Original Title' });
    });

    it('should update task title', () => {
      const updated = taskService.updateTask(task, { title: 'New Title' });

      expect(updated.title).toBe('New Title');
      expect(updated.id).toBe(task.id);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        task.updatedAt.getTime()
      );
    });

    it('should update task description', () => {
      const updated = taskService.updateTask(task, {
        description: 'New description',
      });

      expect(updated.description).toBe('New description');
    });

    it('should update multiple fields', () => {
      const updated = taskService.updateTask(task, {
        title: 'New Title',
        description: 'New description',
        tags: ['new-tag'],
      });

      expect(updated.title).toBe('New Title');
      expect(updated.description).toBe('New description');
      expect(updated.tags).toEqual(['new-tag']);
    });

    it('should not mutate original task', () => {
      const originalTitle = task.title;
      taskService.updateTask(task, { title: 'New Title' });

      expect(task.title).toBe(originalTitle);
    });

    it('should throw ValidationError when updating to empty title', () => {
      expect(() => taskService.updateTask(task, { title: '' })).toThrow(
        'タスクのタイトルは必須です'
      );
    });
  });

  describe('moveTaskToQuadrant', () => {
    let task: Task;

    beforeEach(() => {
      task = taskService.createTask({ title: 'Test Task' });
    });

    it('should move task to important-urgent quadrant', () => {
      const moved = taskService.moveTaskToQuadrant(task, 'important-urgent');

      expect(moved.quadrant).toBe('important-urgent');
      expect(moved.updatedAt.getTime()).toBeGreaterThanOrEqual(
        task.updatedAt.getTime()
      );
    });

    it('should move task to different quadrants', () => {
      const quadrants = [
        'important-urgent',
        'important-not-urgent',
        'not-important-urgent',
        'not-important-not-urgent',
      ] as const;

      quadrants.forEach((quadrant) => {
        const moved = taskService.moveTaskToQuadrant(task, quadrant);
        expect(moved.quadrant).toBe(quadrant);
      });
    });

    it('should not mutate original task', () => {
      const originalQuadrant = task.quadrant;
      taskService.moveTaskToQuadrant(task, 'important-urgent');

      expect(task.quadrant).toBe(originalQuadrant);
    });
  });

  describe('pinTaskToToday', () => {
    let task: Task;

    beforeEach(() => {
      task = taskService.createTask({ title: 'Test Task' });
    });

    it('should pin task to today panel', () => {
      const pinned = taskService.pinTaskToToday(task);

      expect(pinned.isPinnedToToday).toBe(true);
      expect(pinned.updatedAt.getTime()).toBeGreaterThanOrEqual(
        task.updatedAt.getTime()
      );
    });

    it('should not mutate original task', () => {
      taskService.pinTaskToToday(task);
      expect(task.isPinnedToToday).toBe(false);
    });
  });

  describe('unpinTaskFromToday', () => {
    let task: Task;

    beforeEach(() => {
      task = taskService.createTask({ title: 'Test Task' });
      task = taskService.pinTaskToToday(task);
    });

    it('should unpin task from today panel', () => {
      const unpinned = taskService.unpinTaskFromToday(task);

      expect(unpinned.isPinnedToToday).toBe(false);
      expect(unpinned.updatedAt.getTime()).toBeGreaterThanOrEqual(
        task.updatedAt.getTime()
      );
    });

    it('should not mutate original task', () => {
      taskService.unpinTaskFromToday(task);
      expect(task.isPinnedToToday).toBe(true);
    });
  });

  describe('completeTask', () => {
    let task: Task;

    beforeEach(() => {
      task = taskService.createTask({ title: 'Test Task' });
    });

    it('should mark task as completed', () => {
      const completed = taskService.completeTask(task);

      expect(completed.completedAt).toBeInstanceOf(Date);
      expect(completed.updatedAt.getTime()).toBeGreaterThanOrEqual(
        task.updatedAt.getTime()
      );
    });

    it('should not mutate original task', () => {
      taskService.completeTask(task);
      expect(task.completedAt).toBeUndefined();
    });
  });

  describe('uncompleteTask', () => {
    let completedTask: Task;

    beforeEach(() => {
      const task = taskService.createTask({ title: 'Test Task' });
      completedTask = taskService.completeTask(task);
    });

    it('should clear completedAt', () => {
      const restored = taskService.uncompleteTask(completedTask);
      expect(restored.completedAt).toBeUndefined();
    });

    it('should update updatedAt', () => {
      const restored = taskService.uncompleteTask(completedTask);
      expect(restored.updatedAt.getTime()).toBeGreaterThanOrEqual(
        completedTask.updatedAt.getTime()
      );
    });

    it('should not mutate original task', () => {
      taskService.uncompleteTask(completedTask);
      expect(completedTask.completedAt).toBeInstanceOf(Date);
    });
  });
});
