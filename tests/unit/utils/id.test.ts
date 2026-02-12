import { describe, it, expect } from 'vitest';
import { generateId } from '../../../src/utils/id';

describe('generateId', () => {
  it('UUID v4形式の文字列を生成する', () => {
    const id = generateId();

    // UUID v4のフォーマットをチェック
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it('呼び出すたびに異なるIDを生成する', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
  });
});
