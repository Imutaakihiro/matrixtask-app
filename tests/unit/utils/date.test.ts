import { describe, it, expect } from 'vitest';
import {
  getTomorrow,
  getNextWeekend,
  getNextWeek,
  formatDate,
  isToday,
  isPast,
} from '../../../src/utils/date';

describe('date utils', () => {
  describe('getTomorrow', () => {
    it('should return tomorrow at midnight', () => {
      const tomorrow = getTomorrow();
      const expected = new Date();
      expected.setDate(expected.getDate() + 1);
      expected.setHours(0, 0, 0, 0);

      expect(tomorrow.getDate()).toBe(expected.getDate());
      expect(tomorrow.getMonth()).toBe(expected.getMonth());
      expect(tomorrow.getHours()).toBe(0);
      expect(tomorrow.getMinutes()).toBe(0);
      expect(tomorrow.getSeconds()).toBe(0);
    });
  });

  describe('getNextWeekend', () => {
    it('should return next Saturday at midnight', () => {
      const nextWeekend = getNextWeekend();

      // Saturday is day 6
      expect(nextWeekend.getDay()).toBe(6);
      expect(nextWeekend.getHours()).toBe(0);
      expect(nextWeekend.getMinutes()).toBe(0);
      expect(nextWeekend.getSeconds()).toBe(0);
    });

    it('should return a future date', () => {
      const nextWeekend = getNextWeekend();
      const now = new Date();

      expect(nextWeekend.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });
  });

  describe('getNextWeek', () => {
    it('should return next Monday at midnight', () => {
      const nextWeek = getNextWeek();

      // Monday is day 1
      expect(nextWeek.getDay()).toBe(1);
      expect(nextWeek.getHours()).toBe(0);
      expect(nextWeek.getMinutes()).toBe(0);
      expect(nextWeek.getSeconds()).toBe(0);
    });

    it('should return a future date', () => {
      const nextWeek = getNextWeek();
      const now = new Date();

      expect(nextWeek.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('formatDate', () => {
    it('should format date in Japanese format', () => {
      const date = new Date('2026-02-15');
      const formatted = formatDate(date);

      expect(formatted).toBe('2026年2月15日');
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2026-01-05');
      const formatted = formatDate(date);

      expect(formatted).toBe('2026年1月5日');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should ignore time component', () => {
      const todayMorning = new Date();
      todayMorning.setHours(0, 0, 0, 0);

      const todayEvening = new Date();
      todayEvening.setHours(23, 59, 59, 999);

      expect(isToday(todayMorning)).toBe(true);
      expect(isToday(todayEvening)).toBe(true);
    });
  });

  describe('isPast', () => {
    it('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isPast(yesterday)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isPast(today)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isPast(tomorrow)).toBe(false);
    });

    it('should consider earlier times today as past', () => {
      const todayMorning = new Date();
      todayMorning.setHours(0, 0, 0, 0);

      // date-fns isPast checks if the date is before now, including earlier today
      expect(isPast(todayMorning)).toBe(true);
    });
  });
});
