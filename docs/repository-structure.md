# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト構造

```
matrixtask/
├── src/                      # ソースコード
│   ├── components/           # Reactコンポーネント (UIレイヤー)
│   ├── stores/               # Zustand状態管理 (状態管理レイヤー)
│   ├── services/             # ビジネスロジック (サービスレイヤー)
│   ├── types/                # TypeScript型定義
│   ├── utils/                # ユーティリティ関数
│   ├── App.tsx               # メインアプリコンポーネント
│   ├── main.tsx              # エントリーポイント
│   └── index.css             # グローバルスタイル
├── tests/                    # テストコード
│   ├── unit/                 # ユニットテスト
│   ├── integration/          # 統合テスト
│   └── e2e/                  # E2Eテスト
├── public/                   # 静的ファイル
│   └── favicon.ico
├── docs/                     # プロジェクトドキュメント
│   ├── ideas/                # アイデア・壁打ちメモ
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md (本ドキュメント)
│   ├── development-guidelines.md
│   └── glossary.md
├── .steering/                # ステアリングファイル（作業計画）
├── .claude/                  # Claude Code設定
├── .devcontainer/            # 開発コンテナ設定
├── index.html                # HTMLエントリーポイント
├── vite.config.ts            # Viteビルド設定
├── tsconfig.json             # TypeScript設定
├── tailwind.config.js        # Tailwind CSS設定
├── package.json              # npm依存関係
└── README.md                 # プロジェクト概要
```

## ディレクトリ詳細

### src/ (ソースコードディレクトリ)

#### components/

**役割**: Reactコンポーネントの配置（UIレイヤー）

**配置ファイル**:
- `*.tsx`: Reactコンポーネント
- プレゼンテーション層とコンテナ層を区別しない（小規模アプリのため）

**命名規則**:
- PascalCase
- コンポーネント名をファイル名とする
- 例: `TaskCard.tsx`, `InboxBar.tsx`, `TodayPanel.tsx`

**依存関係**:
- 依存可能: `stores/`, `services/`, `types/`, `utils/`
- 依存禁止: なし（最上位レイヤー）

**例**:
```
components/
├── InboxBar.tsx              # 受信箱コンポーネント
├── MatrixView.tsx            # マトリクス表示コンポーネント
├── QuadrantCard.tsx          # 象限カードコンポーネント
├── TodayPanel.tsx            # 今日やることパネル
├── TaskCard.tsx              # タスクカードコンポーネント
├── TaskDetailModal.tsx       # タスク詳細モーダル
└── NaturalLanguageInput.tsx  # 自然言語入力コンポーネント
```

#### stores/

**役割**: Zustandによる状態管理（状態管理レイヤー）

**配置ファイル**:
- `*Store.ts`: Zustandストア定義
- アプリケーション全体の状態を一元管理

**命名規則**:
- camelCase + `Store`接尾辞
- 例: `taskStore.ts`, `uiStore.ts`

**依存関係**:
- 依存可能: `services/`, `types/`
- 依存禁止: `components/`

**例**:
```
stores/
└── taskStore.ts              # タスク状態管理
    - tasks: Task[]
    - アクション: createTask, updateTask, deleteTask, etc.
```

#### services/

**役割**: ビジネスロジックの実装（サービスレイヤー）

**配置ファイル**:
- `*Service.ts`: サービスクラス
- ビジネスロジック、データ変換、バリデーション

**命名規則**:
- PascalCase + `Service`接尾辞
- 例: `TaskService.ts`, `StorageService.ts`

**依存関係**:
- 依存可能: `types/`, `utils/`
- 依存禁止: `components/`, `stores/`

**例**:
```
services/
├── TaskService.ts            # タスクのCRUD操作、ビジネスロジック
├── NaturalLanguageParser.ts  # 自然言語入力のパース
└── StorageService.ts         # LocalStorageへの永続化
```

#### types/

**役割**: TypeScript型定義の集約

**配置ファイル**:
- `*.ts`: インターフェース、型エイリアス、enumの定義

**命名規則**:
- PascalCase（型名）
- kebab-case（ファイル名、複数の型を含む場合）
- 例: `task.ts`, `app-state.ts`

**依存関係**:
- 依存可能: なし（最下位レイヤー）
- 依存禁止: すべて（純粋な型定義のみ）

**例**:
```
types/
├── task.ts                   # Task, Quadrant, ParsedTask等
└── store.ts                  # AppState等
```

#### utils/

**役割**: 汎用ユーティリティ関数

**配置ファイル**:
- `*.ts`: 純粋関数（副作用なし）
- 複数のレイヤーで使用される共通処理

**命名規則**:
- camelCase（関数名）
- 動詞で始める
- 例: `formatDate.ts`, `generateId.ts`

**依存関係**:
- 依存可能: `types/`（型定義のみ）
- 依存禁止: `components/`, `stores/`, `services/`

**例**:
```
utils/
├── date.ts                   # 日付操作関数
├── id.ts                     # UUID生成
└── validation.ts             # バリデーション関数
```

### tests/ (テストディレクトリ)

#### unit/

**役割**: ユニットテストの配置

**構造**:
```
tests/unit/
├── services/                 # サービスレイヤーのテスト
│   ├── TaskService.test.ts
│   ├── NaturalLanguageParser.test.ts
│   └── StorageService.test.ts
└── utils/                    # ユーティリティのテスト
    ├── date.test.ts
    └── validation.test.ts
```

**命名規則**:
- パターン: `[テスト対象ファイル名].test.ts`
- 例: `TaskService.ts` → `TaskService.test.ts`

**テスト対象**:
- サービスレイヤー（ビジネスロジック）
- ユーティリティ関数
- 純粋関数

#### integration/

**役割**: 統合テストの配置

**構造**:
```
tests/integration/
├── task-management/          # タスク管理機能の統合テスト
│   ├── task-creation.test.tsx
│   ├── task-classification.test.tsx
│   └── task-completion.test.tsx
└── storage/                  # ストレージ統合テスト
    └── persistence.test.ts
```

**テスト対象**:
- コンポーネントとストアの連携
- サービスとLocalStorageの連携
- ドラッグ&ドロップ操作

#### e2e/

**役割**: E2Eテストの配置

**構造**:
```
tests/e2e/
├── user-workflows/           # ユーザーシナリオ
│   ├── onboarding.spec.ts
│   ├── task-management.spec.ts
│   └── today-workflow.spec.ts
└── playwright.config.ts      # Playwright設定
```

**テスト対象**:
- ユーザーの典型的な操作フロー
- 初回アクセスからタスク完了まで
- ページリロード後のデータ復元

### docs/ (ドキュメントディレクトリ)

**配置ドキュメント**:

#### 永続的ドキュメント（プロジェクト全体の北極星）:
- `product-requirements.md`: プロダクト要求定義書
- `functional-design.md`: 機能設計書
- `architecture.md`: アーキテクチャ設計書
- `repository-structure.md`: リポジトリ構造定義書(本ドキュメント)
- `development-guidelines.md`: 開発ガイドライン
- `glossary.md`: 用語集

#### アイデア・壁打ちメモ（下書き）:
```
docs/ideas/
└── *.md                      # 自由形式のアイデアメモ
```

### .steering/ (ステアリングファイル)

**役割**: 特定の開発作業における「今回何をするか」を定義

**構造**:
```
.steering/
└── [YYYYMMDD]-[task-name]/
    ├── requirements.md       # 今回の作業の要求内容
    ├── design.md             # 変更内容の設計
    └── tasklist.md           # タスクリスト（進捗管理）
```

**命名規則**: `20260211-add-user-profile` 形式

**例**:
```
.steering/
├── 20260211-setup-project/
├── 20260212-implement-inbox/
└── 20260213-add-matrix-view/
```

### public/ (静的ファイルディレクトリ)

**配置ファイル**:
- `favicon.ico`: ファビコン
- 画像、フォント等の静的アセット

### .claude/ (Claude Code設定)

**役割**: Claude Code設定とカスタマイズ

**構造**:
```
.claude/
├── skills/                   # タスクモード別スキル
│   ├── prd-writing/
│   ├── functional-design/
│   ├── architecture-design/
│   ├── repository-structure/
│   ├── development-guidelines/
│   ├── glossary-creation/
│   └── steering/
└── (その他設定ファイル)
```

## ファイル配置規則

### ソースファイル

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| Reactコンポーネント | `src/components/` | PascalCase.tsx | `TaskCard.tsx` |
| Zustandストア | `src/stores/` | camelCase + Store.ts | `taskStore.ts` |
| サービスクラス | `src/services/` | PascalCase + Service.ts | `TaskService.ts` |
| 型定義 | `src/types/` | kebab-case.ts | `task.ts` |
| ユーティリティ | `src/utils/` | camelCase.ts | `formatDate.ts` |

### テストファイル

| テスト種別 | 配置先 | 命名規則 | 例 |
|-----------|--------|---------|-----|
| ユニットテスト | `tests/unit/` | [対象].test.ts | `TaskService.test.ts` |
| 統合テスト | `tests/integration/` | [機能].test.tsx | `task-creation.test.tsx` |
| E2Eテスト | `tests/e2e/` | [シナリオ].spec.ts | `task-management.spec.ts` |

### 設定ファイル

| ファイル種別 | 配置先 | 命名規則 |
|------------|--------|---------|
| Vite設定 | プロジェクトルート | `vite.config.ts` |
| TypeScript設定 | プロジェクトルート | `tsconfig.json` |
| Tailwind設定 | プロジェクトルート | `tailwind.config.js` |
| ESLint設定 | プロジェクトルート | `eslint.config.js` |
| Prettier設定 | プロジェクトルート | `.prettierrc` |

## 命名規則

### ディレクトリ名

- **レイヤーディレクトリ**: 複数形、kebab-case
  - 例: `components/`, `services/`, `stores/`
- **機能ディレクトリ**: 単数形、kebab-case（該当する場合）
  - 例: `task-management/`, `user-authentication/`

### ファイル名

- **Reactコンポーネント**: PascalCase
  - 例: `TaskCard.tsx`, `InboxBar.tsx`
- **サービスクラス**: PascalCase + Service接尾辞
  - 例: `TaskService.ts`, `StorageService.ts`
- **ストア**: camelCase + Store接尾辞
  - 例: `taskStore.ts`, `uiStore.ts`
- **ユーティリティ関数**: camelCase、動詞で始める
  - 例: `formatDate.ts`, `generateId.ts`
- **型定義**: kebab-case
  - 例: `task.ts`, `app-state.ts`

### テストファイル名

- ユニット・統合テスト: `[テスト対象].test.ts` または `[テスト対象].test.tsx`
- E2Eテスト: `[シナリオ].spec.ts`
- 例: `TaskService.test.ts`, `task-creation.test.tsx`, `user-workflow.spec.ts`

## 依存関係のルール

### レイヤー間の依存

```
components/ (UIレイヤー)
    ↓ (OK)
stores/ (状態管理レイヤー)
    ↓ (OK)
services/ (サービスレイヤー)
    ↓ (OK)
LocalStorage (データレイヤー)
```

**許可される依存**:
- `components/` → `stores/`, `services/`, `types/`, `utils/`
- `stores/` → `services/`, `types/`, `utils/`
- `services/` → `types/`, `utils/`
- `types/`, `utils/` → 依存なし

**禁止される依存**:
- `services/` → `stores/` (❌)
- `services/` → `components/` (❌)
- `stores/` → `components/` (❌)
- `utils/` → `services/`, `stores/`, `components/` (❌)

### モジュール間の依存

**循環依存の禁止**:
```typescript
// ❌ 悪い例: 循環依存
// TaskService.ts
import { UserService } from './UserService';

// UserService.ts
import { TaskService } from './TaskService';  // 循環依存
```

**解決策: 型定義の抽出**:
```typescript
// types/service.ts
export interface ITaskService { /* ... */ }
export interface IUserService { /* ... */ }

// TaskService.ts
import type { IUserService } from '../types/service';

// UserService.ts
import type { ITaskService } from '../types/service';
```

## スケーリング戦略

### 機能の追加

新しい機能を追加する際の配置方針:

1. **小規模機能**: 既存ディレクトリに配置
   - 新しいコンポーネント: `components/` に追加
   - 新しいサービス: `services/` に追加

2. **中規模機能**: サブディレクトリを作成（ファイル数10個以上）
   ```
   components/
   ├── matrix/               # マトリクス関連コンポーネント
   │   ├── MatrixView.tsx
   │   ├── QuadrantCard.tsx
   │   └── DragOverlay.tsx
   └── inbox/                # 受信箱関連コンポーネント
       ├── InboxBar.tsx
       └── InboxItem.tsx
   ```

3. **大規模機能**: 独立したモジュール（Post-MVP）
   ```
   src/
   ├── features/
   │   ├── timeline/         # タイムライン機能（フェーズ2）
   │   └── pomodoro/         # ポモドーロ機能（フェーズ2）
   ```

### ファイルサイズの管理

**ファイル分割の目安**:
- 1ファイル: 300行以下を推奨
- 300-500行: リファクタリングを検討
- 500行以上: 分割を強く推奨

**分割方法**:
```typescript
// 悪い例: 1ファイルに全機能 (800行)
// TaskService.ts

// 良い例: 責務ごとに分割
// TaskService.ts (200行) - CRUD操作
// TaskValidation.ts (150行) - バリデーション
// TaskParser.ts (100行) - 自然言語パース
```

## 除外設定

### .gitignore

プロジェクトで除外すべきファイル:
```
# 依存関係
node_modules/

# ビルド成果物
dist/
build/

# 環境変数
.env
.env.local

# ログ
*.log

# OS固有
.DS_Store
Thumbs.db

# エディタ
.vscode/
.idea/

# テストカバレッジ
coverage/

# ステアリングファイル（任意、チームで決定）
.steering/
```

### .prettierignore, .eslintignore

ツールで除外すべきファイル:
```
# ビルド成果物
dist/
build/

# 依存関係
node_modules/

# 設定ファイル
*.config.js

# ステアリングファイル
.steering/

# テストカバレッジ
coverage/
```

## チェックリスト

- [x] 各ディレクトリの役割が明確に定義されている
- [x] レイヤー構造がディレクトリに反映されている
- [x] 命名規則が一貫している
- [x] テストコードの配置方針が決まっている
- [x] 依存関係のルールが明確である
- [x] 循環依存がない設計になっている
- [x] スケーリング戦略が考慮されている
- [x] 除外設定が定義されている
- [x] ドキュメントの配置場所が明確である
