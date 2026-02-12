import type { Quadrant } from '../types/task';

/**
 * 指定されたIDが有効な象限IDかどうかを判定する
 * @param id - チェック対象のID
 * @returns 象限IDの場合はtrue、それ以外はfalse
 */
export function isQuadrant(id: string): id is Quadrant {
  return [
    'important-urgent',
    'important-not-urgent',
    'not-important-urgent',
    'not-important-not-urgent',
  ].includes(id);
}
