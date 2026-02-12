import { describe, it, expect } from 'vitest';
import { NaturalLanguageParser } from '../../../src/services/NaturalLanguageParser';

describe('NaturalLanguageParser', () => {
  const parser = new NaturalLanguageParser();

  describe('parse', () => {
    it('should parse simple text without date or tags', () => {
      const result = parser.parse('買い物に行く');
      expect(result.title).toBe('買い物に行く');
      expect(result.dueDate).toBeUndefined();
      expect(result.tags).toEqual([]);
    });

    it('should extract "明日" as tomorrow', () => {
      const result = parser.parse('明日 買い物に行く');
      expect(result.title).toBe('買い物に行く');
      expect(result.dueDate).toBeDefined();

      // Verify it's tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      expect(result.dueDate?.getDate()).toBe(tomorrow.getDate());
      expect(result.dueDate?.getMonth()).toBe(tomorrow.getMonth());
    });

    it('should extract "今週末" as next Saturday', () => {
      const result = parser.parse('今週末 レポートを書く');
      expect(result.title).toBe('レポートを書く');
      expect(result.dueDate).toBeDefined();

      // Verify it's Saturday (day 6)
      expect(result.dueDate?.getDay()).toBe(6);
    });

    it('should extract "来週" as next week Monday', () => {
      const result = parser.parse('来週 会議');
      expect(result.title).toBe('会議');
      expect(result.dueDate).toBeDefined();

      // Verify it's Monday (day 1)
      expect(result.dueDate?.getDay()).toBe(1);
    });

    it('should extract tags with #', () => {
      const result = parser.parse('買い物に行く #仕事 #重要');
      expect(result.title).toBe('買い物に行く');
      expect(result.tags).toEqual(['仕事', '重要']);
    });

    it('should extract both date and tags', () => {
      const result = parser.parse('明日 買い物に行く #仕事');
      expect(result.title).toBe('買い物に行く');
      expect(result.dueDate).toBeDefined();
      expect(result.tags).toEqual(['仕事']);
    });

    it('should handle tags at the beginning', () => {
      const result = parser.parse('#重要 #緊急 タスクを完了する');
      expect(result.title).toBe('タスクを完了する');
      expect(result.tags).toEqual(['重要', '緊急']);
    });

    it('should handle mixed date and tags', () => {
      const result = parser.parse(
        '来週 #プロジェクト 新機能を実装する #優先度高'
      );
      expect(result.title).toBe('新機能を実装する');
      expect(result.dueDate).toBeDefined();
      expect(result.tags).toEqual(['プロジェクト', '優先度高']);
    });

    it('should handle empty input gracefully', () => {
      const result = parser.parse('');
      expect(result.title).toBe('');
      expect(result.dueDate).toBeUndefined();
      expect(result.tags).toEqual([]);
    });

    it('should handle only tags', () => {
      const result = parser.parse('#タグのみ');
      expect(result.title).toBe('');
      expect(result.tags).toEqual(['タグのみ']);
    });

    it('should handle only date', () => {
      const result = parser.parse('明日');
      expect(result.title).toBe('');
      expect(result.dueDate).toBeDefined();
    });
  });
});
