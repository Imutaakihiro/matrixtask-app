import {
  addDays,
  startOfDay,
  nextSaturday,
  nextMonday,
  isToday as isTodayFn,
  isPast as isPastFn,
} from 'date-fns';

/**
 * 明日の00:00を返す
 *
 * @returns 明日の00:00のDateオブジェクト
 *
 * @example
 * ```typescript
 * const tomorrow = getTomorrow();
 * // 今日が2026-02-11なら、2026-02-12 00:00:00 を返す
 * ```
 */
export function getTomorrow(): Date {
  return startOfDay(addDays(new Date(), 1));
}

/**
 * 今週末（土曜日）の00:00を返す
 *
 * @returns 今週末（土曜日）の00:00のDateオブジェクト
 *
 * @example
 * ```typescript
 * const weekend = getThisWeekend();
 * // 今日が2026-02-11（水）なら、2026-02-14（土）00:00:00 を返す
 * ```
 */
export function getThisWeekend(): Date {
  return startOfDay(nextSaturday(new Date()));
}

/**
 * 来週（月曜日）の00:00を返す
 *
 * @returns 来週（月曜日）の00:00のDateオブジェクト
 *
 * @example
 * ```typescript
 * const nextWeek = getNextWeek();
 * // 今日が2026-02-11（水）なら、2026-02-16（月）00:00:00 を返す
 * ```
 */
export function getNextWeek(): Date {
  return startOfDay(nextMonday(new Date()));
}

/**
 * 指定した日数後の00:00を返す
 *
 * @param days - 日数
 * @returns 指定日数後の00:00のDateオブジェクト
 *
 * @example
 * ```typescript
 * const future = getDaysLater(7);
 * // 今日から7日後の00:00:00を返す
 * ```
 */
export function getDaysLater(days: number): Date {
  return startOfDay(addDays(new Date(), days));
}

/**
 * 日付を日本語形式でフォーマットする
 *
 * @param date - フォーマットする日付
 * @returns 日本語形式の日付文字列（例: "2026年2月11日"）
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date('2026-02-11'));
 * // "2026年2月11日"
 * ```
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 指定された日付が今日かどうかを判定する
 *
 * @param date - 判定する日付
 * @returns 今日の場合true、それ以外はfalse
 *
 * @example
 * ```typescript
 * const result = isToday(new Date());
 * // true
 * ```
 */
export function isToday(date: Date): boolean {
  return isTodayFn(date);
}

/**
 * 指定された日付が過去かどうかを判定する
 *
 * @param date - 判定する日付
 * @returns 過去の場合true、それ以外はfalse
 *
 * @example
 * ```typescript
 * const yesterday = new Date();
 * yesterday.setDate(yesterday.getDate() - 1);
 * const result = isPast(yesterday);
 * // true
 * ```
 */
export function isPast(date: Date): boolean {
  return isPastFn(date);
}

/**
 * getNextWeekend is an alias for getThisWeekend for test compatibility
 */
export const getNextWeekend = getThisWeekend;
