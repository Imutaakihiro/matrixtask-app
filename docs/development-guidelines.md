# 開発ガイドライン (Development Guidelines)

## コーディング規約

### 命名規則

#### 変数・関数

**TypeScript/React**:
```typescript
// ✅ 良い例
const taskList = getTasks();
const isPinnedToToday = task.isPinnedToToday;
function calculateQuadrant(task: Task): Quadrant { }

// ❌ 悪い例
const data = get();
const flag = task.f;
function calc(t: any): any { }
```

**原則**:
- 変数: camelCase、名詞または名詞句
- 関数: camelCase、動詞で始める
- 定数: UPPER_SNAKE_CASE
- Boolean: `is`, `has`, `should`, `can`で始める
- Reactコンポーネント: PascalCase

#### クラス・インターフェース・型

```typescript
// Reactコンポーネント: PascalCase
const TaskCard: React.FC<TaskCardProps> = ({ task }) => { };
const MatrixView: React.FC<MatrixViewProps> = ({ tasks }) => { };

// インターフェース: PascalCase
interface Task {
  id: string;
  title: string;
}

interface TaskCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

// 型エイリアス: PascalCase
type Quadrant = 'important-urgent' | 'important-not-urgent'
  | 'not-important-urgent' | 'not-important-not-urgent';
type TaskStatus = 'pending' | 'completed';
```

### 型定義

**組み込み型の使用**:
```typescript
// ✅ 良い例: TypeScriptの組み込み型を使用
function filterTasks(tasks: Task[], filter: (task: Task) => boolean): Task[] {
  return tasks.filter(filter);
}

// ❌ 悪い例: any型
function filterTasks(tasks: any[], filter: any): any[] {
  return tasks.filter(filter);
}
```

**インターフェース vs 型エイリアス**:
```typescript
// インターフェース: 拡張可能なオブジェクト型
interface Task {
  id: string;
  title: string;
}

// 型エイリアス: ユニオン型、プリミティブ型
type Quadrant = 'important-urgent' | 'important-not-urgent'
  | 'not-important-urgent' | 'not-important-not-urgent';
```

### コードフォーマット

**インデント**: 2スペース

**行の長さ**: 最大100文字

**例**:
```typescript
// Reactコンポーネント
const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  return (
    <div
      className="task-card"
      onClick={() => onTaskClick(task.id)}
    >
      <h3>{task.title}</h3>
      {task.dueDate && (
        <p>{format(task.dueDate, 'yyyy-MM-dd')}</p>
      )}
    </div>
  );
};
```

### コメント規約

**関数・コンポーネントのドキュメント**:
```typescript
/**
 * タスクを作成する
 *
 * @param data - 作成するタスクのデータ
 * @returns 作成されたタスク
 * @throws {ValidationError} データが不正な場合
 *
 * @example
 * ```typescript
 * const task = taskStore.createTask({
 *   title: '新しいタスク',
 *   quadrant: 'important-urgent'
 * });
 * ```
 */
function createTask(data: CreateTaskData): Task {
  // 実装
}
```

**インラインコメント**:
```typescript
// ✅ 良い例: なぜそうするかを説明
// LocalStorageの容量を確保するため、古いデータを削除
cleanupOldTasks();

// ❌ 悪い例: 何をしているか(コードを見れば分かる)
// 古いタスクをクリーンアップする
cleanupOldTasks();
```

### エラーハンドリング

**原則**:
- 予期されるエラー: 適切なエラークラスを定義
- 予期しないエラー: 上位に伝播
- エラーを無視しない

**例**:
```typescript
// エラークラス定義
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

// エラーハンドリング（Reactコンポーネント内）
const handleTaskCreate = (title: string) => {
  try {
    taskStore.createTask({ title });
  } catch (error) {
    if (error instanceof ValidationError) {
      toast.error(`検証エラー: ${error.message}`);
    } else if (error instanceof StorageError) {
      toast.error('保存に失敗しました。もう一度お試しください。');
    } else {
      console.error('予期しないエラー:', error);
      toast.error('エラーが発生しました');
    }
  }
};
```

### Reactコンポーネント設計

**関数コンポーネント + Hooksを使用**:
```typescript
// ✅ 良い例: 関数コンポーネント
const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`task-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onTaskClick(task.id)}
    >
      <h3>{task.title}</h3>
    </div>
  );
};

// ❌ 悪い例: クラスコンポーネント（使用しない）
class TaskCard extends React.Component { }
```

**カスタムフックの活用**:
```typescript
// ✅ 良い例: ロジックをカスタムフックに分離
function useTasks() {
  const tasks = taskStore((state) => state.tasks);
  const createTask = taskStore((state) => state.createTask);
  const updateTask = taskStore((state) => state.updateTask);

  return { tasks, createTask, updateTask };
}

// コンポーネントで使用
const TaskList: React.FC = () => {
  const { tasks, createTask } = useTasks();

  return (
    <div>
      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
};
```

## Git運用ルール

### ブランチ戦略（Git Flow採用）

**Git Flowとは**:
Vincent Driessenが提唱した、機能開発・リリース・ホットフィックスを体系的に管理するブランチモデル。明確な役割分担により、チーム開発での並行作業と安定したリリースを実現します。

**ブランチ構成**:
```
main (本番環境)
└── develop (開発・統合環境)
    ├── feature/inbox-bar (新機能: 受信箱)
    ├── feature/matrix-view (新機能: マトリクス表示)
    └── fix/task-validation (バグ修正: タスク検証)
```

**運用ルール**:
- **main**: 本番リリース済みの安定版コードのみを保持。タグでバージョン管理
- **develop**: 次期リリースに向けた最新の開発コードを統合。CIでの自動テスト実施
- **feature/\*、fix/\***: developから分岐し、作業完了後にPRでdevelopへマージ
- **直接コミット禁止**: すべてのブランチでPRレビューを必須とし、コード品質を担保
- **マージ方針**: feature→develop は squash merge、develop→main は merge commit を推奨

### コミットメッセージ規約

**Conventional Commitsを採用**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type一覧**:
```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: コードフォーマット
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド、依存関係更新など
```

**良いコミットメッセージの例**:
```
feat(inbox): 受信箱コンポーネントを追加

ユーザーがタスクをまず受信箱に追加できるようになりました。

実装内容:
- InboxBarコンポーネントの作成
- 自然言語入力のプレースホルダー
- 受信箱からマトリクスへのドラッグ&ドロップ対応

Closes #15
```

### プルリクエストプロセス

**作成前のチェック**:
- [ ] 全てのテストがパス（`npm run test`）
- [ ] Lintエラーがない（`npm run lint`）
- [ ] 型チェックがパス（`npm run typecheck`）
- [ ] ビルドが成功（`npm run build`）
- [ ] 競合が解決されている

**PRテンプレート**:
```markdown
## 変更の種類
- [ ] 新機能 (feat)
- [ ] バグ修正 (fix)
- [ ] リファクタリング (refactor)
- [ ] ドキュメント (docs)
- [ ] その他 (chore)

## 変更内容
### 何を変更したか
[簡潔な説明]

### なぜ変更したか
[背景・理由]

### どのように変更したか
- [変更点1]
- [変更点2]

## テスト
### 実施したテスト
- [ ] ユニットテスト追加
- [ ] 統合テスト追加
- [ ] 手動テスト実施

### テスト結果
[テスト結果の説明]

## スクリーンショット（UI変更の場合）
[画像]

## 関連Issue
Closes #[番号]

## レビューポイント
[レビュアーに特に見てほしい点]
```

**レビュープロセス**:
1. セルフレビュー（作成者が自分のコードを見直す）
2. 自動テスト実行（GitHub Actions）
3. レビュアーアサイン
4. レビューフィードバック対応
5. 承認後マージ

## テスト戦略

### テストの種類

#### ユニットテスト

**対象**: 個別の関数・サービスクラス

**カバレッジ目標**: 80%以上

**例**:
```typescript
// tests/unit/services/NaturalLanguageParser.test.ts
import { describe, it, expect } from 'vitest';
import { NaturalLanguageParser } from '@/services/NaturalLanguageParser';

describe('NaturalLanguageParser', () => {
  describe('parse', () => {
    it('「明日」を正しくパースできる', () => {
      // Given: 準備
      const parser = new NaturalLanguageParser();
      const input = '明日までにレポート作成';

      // When: 実行
      const result = parser.parse(input);

      // Then: 検証
      expect(result.title).toBe('までにレポート作成');
      expect(result.dueDate).toBeDefined();
      expect(result.dueDate?.getDate()).toBe(new Date().getDate() + 1);
    });

    it('「#重要」をタグとして抽出できる', () => {
      // Given: 準備
      const parser = new NaturalLanguageParser();
      const input = 'レポート作成 #重要 #緊急';

      // When: 実行
      const result = parser.parse(input);

      // Then: 検証
      expect(result.tags).toEqual(['重要', '緊急']);
    });
  });
});
```

#### 統合テスト

**対象**: コンポーネントとストアの連携

**例**:
```typescript
// tests/integration/task-creation.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InboxBar } from '@/components/InboxBar';
import { taskStore } from '@/stores/taskStore';

describe('タスク作成フロー', () => {
  beforeEach(() => {
    taskStore.getState().reset();
  });

  it('受信箱でタスクを作成できる', async () => {
    // Given: コンポーネントをレンダリング
    render(<InboxBar />);
    const input = screen.getByPlaceholderText('+ タスクを追加...');

    // When: タスクを入力してEnterを押す
    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Then: タスクがストアに追加されている
    const tasks = taskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('新しいタスク');
    expect(tasks[0].quadrant).toBeNull(); // 受信箱
  });
});
```

#### E2Eテスト

**対象**: ユーザーシナリオ全体

**ツール**: Playwright

**例**:
```typescript
// tests/e2e/task-management.spec.ts
import { test, expect } from '@playwright/test';

test('タスクの追加・分類・完了ができる', async ({ page }) => {
  // アプリにアクセス
  await page.goto('http://localhost:5173');

  // タスクを受信箱に追加
  await page.fill('input[placeholder="+ タスクを追加..."]', '新しいタスク');
  await page.keyboard.press('Enter');
  await expect(page.locator('.inbox-item')).toHaveText('新しいタスク');

  // タスクをマトリクスに分類
  await page.dragAndDrop('.inbox-item', '.quadrant-important-urgent');
  await expect(page.locator('.quadrant-important-urgent .task-card')).toHaveText('新しいタスク');

  // タスクを「今日やること」にピン留め
  await page.dragAndDrop('.task-card', '.today-panel');
  await expect(page.locator('.today-panel .task-item')).toHaveText('新しいタスク');

  // タスクを完了
  await page.click('.today-panel .task-item input[type="checkbox"]');
  await expect(page.locator('.today-panel .task-item')).not.toBeVisible();
});
```

### テスト命名規則

**パターン**: 日本語で具体的に記述

**例**:
```typescript
// ✅ 良い例: 具体的で分かりやすい
it('タスクのタイトルが空の場合、ValidationErrorをスローする', () => { });
it('受信箱に追加したタスクはquadrantがnullである', () => { });
it('完了したタスクは「今日やること」から消える', () => { });

// ❌ 悪い例: 曖昧
it('test1', () => { });
it('works', () => { });
it('should work correctly', () => { });
```

### モック・スタブの使用

**原則**:
- LocalStorage: モック化
- 外部API: モック化
- ビジネスロジック: 実装を使用

**例**:
```typescript
// LocalStorageをモック化
const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = mockStorage as any;

// サービスは実際の実装を使用
const service = new TaskService();
```

## コードレビュー基準

### レビューポイント

**機能性**:
- [ ] 要件を満たしているか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か

**可読性**:
- [ ] 命名が明確か
- [ ] コンポーネントが適切に分割されているか
- [ ] 複雑なロジックにコメントがあるか

**保守性**:
- [ ] 重複コードがないか
- [ ] 責務が明確に分離されているか（UIとビジネスロジック）
- [ ] 変更の影響範囲が限定的か

**パフォーマンス**:
- [ ] 不要な再レンダリングがないか（React.memo, useMemo, useCallback）
- [ ] LocalStorageへのアクセスが最小限か
- [ ] ドラッグ&ドロップが60fpsで動作するか

**セキュリティ**:
- [ ] 入力検証が適切か
- [ ] XSS対策（dangerouslySetInnerHTMLを使用していないか）
- [ ] ユーザーデータが適切に保護されているか

### レビューコメントの書き方

**建設的なフィードバック**:
```markdown
## ✅ 良い例
この実装だと、タスク数が増えた時に毎回全体を再レンダリングしてしまいます。
React.memoを使うとパフォーマンスが改善できます:

```typescript
export const TaskCard = React.memo<TaskCardProps>(({ task }) => {
  // ...
});
```
```

**優先度の明示**:
- `[必須]`: 修正必須（セキュリティ、バグ）
- `[推奨]`: 修正推奨（パフォーマンス、可読性）
- `[提案]`: 検討してほしい（設計、代替案）
- `[質問]`: 理解のための質問

## 開発環境セットアップ

### 必要なツール

| ツール | バージョン | インストール方法 |
|--------|-----------|-----------------|
| Node.js | v24.11.0 | [nodejs.org](https://nodejs.org/) |
| npm | 11.x | Node.jsに同梱 |
| Git | 最新版 | [git-scm.com](https://git-scm.com/) |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/your-org/matrixtask.git
cd matrixtask

# 2. devcontainerで開く（推奨）
# VS Codeで「Dev Containers: Reopen in Container」を実行

# または、ローカル環境で開発する場合
# 3. 依存関係のインストール
npm install

# 4. 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

### 推奨開発ツール

**VS Code拡張機能**:
- ESLint: コード品質チェック
- Prettier: 自動フォーマット
- Tailwind CSS IntelliSense: Tailwindクラスの補完
- vscode-styled-components: CSS-in-JSのシンタックスハイライト

**設定**:
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 自動化の推進

### 品質チェックの自動化

**自動化項目と採用ツール**:

1. **Lintチェック**
   - **ESLint 9.x** + **@typescript-eslint**
   - TypeScript専用ルールセットでコーディング規約を統一
   - 潜在的なバグや非推奨パターンを自動検出

2. **コードフォーマット**
   - **Prettier 3.x**
   - コードスタイルを自動整形し、レビュー時の議論を削減
   - ESLintと併用し、競合を回避

3. **型チェック**
   - **TypeScript Compiler (tsc) 5.x**
   - `tsc --noEmit`で型エラーのみをチェック
   - 型安全性を検証

4. **テスト実行**
   - **Vitest 1.x**
   - Viteベースで高速起動・実行
   - TypeScript/ESMをネイティブサポート

5. **E2Eテスト**
   - **Playwright 1.x**
   - クロスブラウザ対応
   - 並列実行でテスト時間を短縮

**実装方法**:

**1. CI/CD (GitHub Actions)**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

**2. Pre-commit フック (Husky + lint-staged)**
```json
// package.json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "vite build"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
npm run typecheck
```

**導入効果**:
- コミット前に自動チェックが走り、不具合コードの混入を防止
- PR作成時に自動でCI実行され、マージ前に品質を担保
- 早期発見により、修正コストを削減

## チェックリスト

実装完了前に確認:

### コード品質
- [ ] 命名が明確で一貫している（camelCase, PascalCase）
- [ ] コンポーネントが適切に分割されている（1コンポーネント = 1責務）
- [ ] 型注釈が適切に記載されている
- [ ] エラーハンドリングが実装されている
- [ ] React.memoやuseMemoで最適化されている（必要に応じて）

### セキュリティ
- [ ] 入力検証が実装されている
- [ ] dangerouslySetInnerHTMLを使用していない
- [ ] LocalStorageへのアクセスが安全

### パフォーマンス
- [ ] 不要な再レンダリングがない
- [ ] ドラッグ&ドロップが滑らか（60fps）
- [ ] 500タスクでも快適に動作する

### テスト
- [ ] ユニットテストが書かれている（カバレッジ80%以上）
- [ ] 統合テストが書かれている（主要フロー）
- [ ] テストがパスする

### ドキュメント
- [ ] コンポーネントにTSDocコメントがある
- [ ] 複雑なロジックにコメントがある
- [ ] TODOやFIXMEが記載されている（該当する場合）

### ツール
- [ ] Lintエラーがない（`npm run lint`）
- [ ] 型チェックがパスする（`npm run typecheck`）
- [ ] フォーマットが統一されている（`npm run format`）
- [ ] ビルドが成功する（`npm run build`）
