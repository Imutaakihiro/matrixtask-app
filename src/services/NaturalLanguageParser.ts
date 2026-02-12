import type { ParsedTask } from '../types/task';
import { getTomorrow, getThisWeekend, getNextWeek } from '../utils/date';

/**
 * 自然言語入力をパースしてタスク情報を抽出するサービス
 *
 * @example
 * ```typescript
 * const parser = new NaturalLanguageParser();
 * const result = parser.parse('明日までにレポート作成 #重要');
 * // => { title: 'までにレポート作成', dueDate: Date(...), tags: ['重要'] }
 * ```
 */
export class NaturalLanguageParser {
  /**
   * 自然言語入力をパースする
   *
   * @param input - ユーザーの入力文字列
   * @returns パース結果
   *
   * @example
   * ```typescript
   * const result = parser.parse('明日までにレポート #重要 #緊急');
   * ```
   */
  parse(input: string): ParsedTask {
    // 1. 期限を抽出
    const { date: dueDate, remaining: afterDate } = this.extractDueDate(input);

    // 2. タグを抽出
    const { tags, remaining: title } = this.extractTags(afterDate);

    return {
      title: title.trim(),
      dueDate,
      tags,
    };
  }

  /**
   * 期限表現を抽出する
   *
   * @param input - 入力文字列
   * @returns 期限とそれ以外の文字列
   */
  private extractDueDate(input: string): { date?: Date; remaining: string } {
    const patterns: Array<{ regex: RegExp; getDate: () => Date }> = [
      { regex: /明日/g, getDate: getTomorrow },
      { regex: /今週末/g, getDate: getThisWeekend },
      { regex: /来週/g, getDate: getNextWeek },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(input)) {
        const date = pattern.getDate();
        const remaining = input.replace(pattern.regex, '').trim();
        return { date, remaining };
      }
    }

    // YYYY-MM-DD 形式の日付
    const datePattern = /(\d{4})-(\d{2})-(\d{2})/g;
    const match = datePattern.exec(input);
    if (match) {
      const [fullMatch, year, month, day] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const remaining = input.replace(fullMatch, '').trim();
      return { date, remaining };
    }

    return { remaining: input };
  }

  /**
   * タグを抽出する
   *
   * @param input - 入力文字列
   * @returns タグとそれ以外の文字列
   */
  private extractTags(input: string): { tags: string[]; remaining: string } {
    // \S+ で空白以外の文字列を全てマッチ（日本語含む）
    const tagPattern = /#(\S+)/g;
    const tags: string[] = [];
    let match;

    while ((match = tagPattern.exec(input)) !== null) {
      tags.push(match[1]);
    }

    // 新しいRegExpオブジェクトを使ってreplaceする（lastIndexの問題を回避）
    const remaining = input.replace(/#\S+/g, '').trim();
    return { tags, remaining };
  }
}
