/**
 * UUID v4を生成する
 *
 * @returns UUID v4形式の文字列
 *
 * @example
 * ```typescript
 * const id = generateId();
 * // => "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function generateId(): string {
  return crypto.randomUUID();
}
