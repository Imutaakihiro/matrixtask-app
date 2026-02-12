import { createClient, type Client } from '@libsql/client';

/**
 * Turso接続エラー
 */
export class TursoConnectionError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'TursoConnectionError';
  }
}

/**
 * Tursoデータベースへの接続を管理するクライアント
 *
 * シングルトンパターンを使用して、アプリケーション全体で1つのクライアントインスタンスを共有します。
 */
export class TursoClient {
  private static instance: Client | null = null;

  /**
   * Tursoクライアントのインスタンスを取得する
   *
   * @returns {Client} Tursoクライアント
   * @throws {TursoConnectionError} 環境変数が設定されていない場合
   *
   * @example
   * ```typescript
   * const client = TursoClient.getClient();
   * const result = await client.execute('SELECT * FROM tasks');
   * ```
   */
  static getClient(): Client {
    if (!this.instance) {
      this.instance = this.createClient();
    }
    return this.instance;
  }

  /**
   * 新しいTursoクライアントを作成する
   *
   * @private
   * @returns {Client} Tursoクライアント
   * @throws {TursoConnectionError} 環境変数が設定されていない場合
   */
  private static createClient(): Client {
    const url = import.meta.env.VITE_TURSO_DATABASE_URL;
    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

    // 環境変数の検証
    if (!url || typeof url !== 'string') {
      throw new TursoConnectionError(
        'VITE_TURSO_DATABASE_URLが設定されていません。.envファイルを確認してください。'
      );
    }

    if (!authToken || typeof authToken !== 'string') {
      throw new TursoConnectionError(
        'VITE_TURSO_AUTH_TOKENが設定されていません。.envファイルを確認してください。'
      );
    }

    try {
      return createClient({
        url,
        authToken,
      });
    } catch (error) {
      throw new TursoConnectionError(
        'Tursoデータベースへの接続に失敗しました。',
        error as Error
      );
    }
  }

  /**
   * クライアントインスタンスをリセットする（テスト用）
   *
   * @internal
   */
  static resetInstance(): void {
    this.instance = null;
  }
}
