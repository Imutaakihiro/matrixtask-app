# プロジェクト用語集 (Glossary)

## 概要

このドキュメントは、MatrixTaskプロジェクト内で使用される用語の定義を管理します。

**更新日**: 2026-02-11

## ドメイン用語

プロジェクト固有のビジネス概念や機能に関する用語。

### 受信箱 (Inbox)

**定義**: タスクを最初に追加する場所。重要度や緊急度を考えずに、まずタスクを記録するための一時的な保管場所。

**説明**:
受信箱は「さっと書いて、後で整理」というコンセプトの核となる機能です。ユーザーはタスクの分類を考える必要がなく、思いついたタスクをすぐに追加できます。受信箱のタスクは後でマトリクスに分類されます。

**関連用語**: [マトリクス](#マトリクス-matrix)、[象限](#象限-quadrant)

**使用例**:
- 「受信箱にタスクを追加する」: タスクを新規作成し、受信箱に配置
- 「受信箱からマトリクスに移動する」: タスクをドラッグ&ドロップで象限に分類

**データモデル**: `src/types/task.ts` - `Task.quadrant === null` の場合、受信箱に所属

**英語表記**: Inbox

### マトリクス (Matrix)

**定義**: アイゼンハワーマトリクスに基づく4象限の表示エリア。重要度と緊急度でタスクを分類する。

**説明**:
マトリクスは常時表示され、タスクを4つの象限に分類して整理します。各象限には重要度と緊急度の組み合わせに応じたタスクが表示されます。

**関連用語**: [象限](#象限-quadrant)、[受信箱](#受信箱-inbox)

**使用例**:
- 「マトリクスでタスクを整理する」: 受信箱のタスクを適切な象限に配置
- 「マトリクス表示を確認する」: 全タスクの分類状況を俯瞰

**実装**: `src/components/MatrixView.tsx`

**英語表記**: Matrix

### 象限 (Quadrant)

**定義**: マトリクス内の4つの分類領域。重要度と緊急度の組み合わせで定義される。

**説明**:
4つの象限は以下のように定義されます：
1. **重要×緊急** (`important-urgent`): 最優先で対応すべきタスク
2. **重要×緊急でない** (`important-not-urgent`): 計画的に対応すべきタスク
3. **重要でない×緊急** (`not-important-urgent`): 委任を検討すべきタスク
4. **重要でない×緊急でない** (`not-important-not-urgent`): 削除を検討すべきタスク

**関連用語**: [マトリクス](#マトリクス-matrix)

**使用例**:
- 「タスクを重要×緊急の象限に移動する」
- 「各象限のタスク数を確認する」

**データモデル**:
```typescript
// src/types/task.ts
type Quadrant =
  | 'important-urgent'
  | 'important-not-urgent'
  | 'not-important-urgent'
  | 'not-important-not-urgent';
```

**英語表記**: Quadrant

### 今日やること (Today)

**定義**: マトリクスから選択した、本日実行するタスクの一覧。実際の行動にフォーカスするためのビュー。

**説明**:
「今日やること」は画面右サイドに固定表示され、マトリクス全体ではなく、今日実行すべきタスクのみを表示します。タスクをドラッグ&ドロップでピン留めすることで追加できます。

**関連用語**: [ピン留め](#ピン留め-pin)、[マトリクス](#マトリクス-matrix)

**使用例**:
- 「タスクを今日やることに追加する」: マトリクスからドラッグ&ドロップでピン留め
- 「今日やることを確認する」: 本日の作業リストを表示

**実装**: `src/components/TodayPanel.tsx`

**英語表記**: Today

### ピン留め (Pin)

**定義**: タスクを「今日やること」に追加する操作。

**説明**:
ピン留めされたタスクは `isPinnedToToday` フラグが `true` になり、「今日やること」パネルに表示されます。マトリクスからのドラッグ&ドロップで実行できます。

**関連用語**: [今日やること](#今日やること-today)

**使用例**:
- 「重要なタスクをピン留めする」
- 「ピン留めを解除する」: チェックボックスで完了またはピン留め解除

**データモデル**: `Task.isPinnedToToday: boolean`

**英語表記**: Pin

### タスク (Task)

**定義**: ユーザーが完了すべき作業の単位。タイトル、説明、期限、タグ、象限、完了状態などの情報を持つ。

**説明**:
タスクはMatrixTaskの中心的なデータモデルです。受信箱→マトリクス→今日やること、という流れで管理されます。

**関連用語**: [受信箱](#受信箱-inbox)、[象限](#象限-quadrant)、[今日やること](#今日やること-today)

**使用例**:
- 「タスクを作成する」: 新しいタスクを受信箱に追加
- 「タスクを完了する」: タスクにチェックを入れる
- 「タスクを編集する」: タイトル、説明、期限などを変更

**データモデル**:
```typescript
// src/types/task.ts
interface Task {
  id: string;                    // UUID v4
  title: string;                 // 1-200文字
  description?: string;          // 説明（オプション）
  quadrant: Quadrant | null;     // 所属象限（nullは受信箱）
  isPinnedToToday: boolean;      // 今日やることにピン留め
  dueDate?: Date;                // 期限
  tags: string[];                // タグリスト
  createdAt: Date;               // 作成日時
  updatedAt: Date;               // 更新日時
  completedAt?: Date;            // 完了日時
}
```

**英語表記**: Task

### 自然言語入力 (Natural Language Input)

**定義**: タスクを自然な文章で入力し、期限やタグを自動的に抽出する機能。

**説明**:
ユーザーは「明日までにレポート #重要」のように入力すると、「明日」を期限として、「#重要」をタグとして自動的にパースします。これにより、入力の手間を削減し、素早くタスクを追加できます。

**認識パターン**:
- 期限表現: 「明日」「今週末」「来週」「YYYY-MM-DD」
- タグ: `#タグ名`

**関連用語**: [タスク](#タスク-task)、[受信箱](#受信箱-inbox)

**使用例**:
- 「明日までにレポート作成 #重要 #緊急」
- 「2026-02-15 会議資料準備」

**実装**: `src/services/NaturalLanguageParser.ts`

**英語表記**: Natural Language Input

## 技術用語

プロジェクトで使用している技術・フレームワーク・ツールに関する用語。

### React

**定義**: FacebookによるUIライブラリ。コンポーネントベースでUIを構築する。

**公式サイト**: https://react.dev/

**本プロジェクトでの用途**:
全てのUIコンポーネントをReactで実装しています。関数コンポーネントとHooksを使用し、クラスコンポーネントは使用しません。

**バージョン**: 18.x

**選定理由**:
- コンポーネントベースで再利用性が高い
- 豊富なエコシステムと実績
- TypeScriptとの親和性が高い
- Hooksによる状態管理が直感的

**関連ドキュメント**: [アーキテクチャ設計書](./architecture.md#技術スタック)

### Vite

**定義**: 次世代フロントエンドビルドツール。高速な開発サーバーとビルドを提供。

**公式サイト**: https://vitejs.dev/

**本プロジェクトでの用途**:
開発サーバーとプロダクションビルドに使用。HMR（Hot Module Replacement）により、コード変更が即座に反映されます。

**バージョン**: 5.x

**選定理由**:
- 高速な開発サーバー起動（数秒 vs Webpack の数十秒）
- TypeScript標準サポート
- モダンなESM対応

**設定ファイル**: `vite.config.ts`

### Zustand

**定義**: 軽量な状態管理ライブラリ。Reduxよりシンプルで、Reactとの統合が容易。

**公式サイト**: https://zustand-demo.pmnd.rs/

**本プロジェクトでの用途**:
アプリケーション全体の状態（タスクリスト、モーダル状態）を管理します。

**バージョン**: 4.x

**選定理由**:
- 軽量（3KB）
- TypeScript親和性が高い
- Reduxより学習コスト低
- 不要なre-renderを防ぐ

**実装**: `src/stores/taskStore.ts`

### dnd kit

**定義**: モダンなドラッグ&ドロップライブラリ。React向けに最適化され、アクセシビリティにも対応。

**公式サイト**: https://dndkit.com/

**本プロジェクトでの用途**:
受信箱からマトリクスへ、マトリクスから今日やることへのタスク移動をドラッグ&ドロップで実現します。

**バージョン**: 6.x

**選定理由**:
- モダンなAPI
- アクセシビリティ対応（キーボード操作可能）
- パフォーマンスが優れている
- React 18対応

### Tailwind CSS

**定義**: ユーティリティファーストなCSSフレームワーク。クラス名を組み合わせてスタイルを適用する。

**公式サイト**: https://tailwindcss.com/

**本プロジェクトでの用途**:
全てのコンポーネントのスタイリングに使用。Notionライクなシンプルで洗練されたUIを実現します。

**バージョン**: 3.x

**選定理由**:
- ユーティリティファーストで高速開発
- Notionライクなシンプルデザインに最適
- バンドルサイズ削減（未使用クラスの自動削除）

**設定ファイル**: `tailwind.config.js`

### TypeScript

**定義**: JavaScriptに静的型付けを追加したプログラミング言語。

**公式サイト**: https://www.typescriptlang.org/

**本プロジェクトでの用途**:
全てのソースコードをTypeScriptで記述し、型安全性を確保しています。

**バージョン**: 5.x

**選定理由**:
- 型安全性による保守性向上
- エディタの補完機能による開発効率向上
- コンパイル時のエラー検出

**関連ドキュメント**: [開発ガイドライン](./development-guidelines.md#TypeScript規約)

**設定ファイル**: `tsconfig.json`

### LocalStorage

**定義**: Webブラウザのローカルストレージ。キーバリュー形式でデータを永続化する。

**公式ドキュメント**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**本プロジェクトでの用途**:
タスクデータをブラウザに保存します。サーバー不要で、プライバシーも保護されます。

**容量制限**: 5MB

**選定理由**:
- サーバー不要（MVP段階ではコスト削減）
- オフライン動作
- プライバシー保護（データは外部送信されない）

**実装**: `src/services/StorageService.ts`

### Vitest

**定義**: Viteベースのユニットテストフレームワーク。JestライクなAPIを提供。

**公式サイト**: https://vitest.dev/

**本プロジェクトでの用途**:
ユニットテストと統合テストの実行。

**バージョン**: 1.x

**選定理由**:
- Viteネイティブで高速
- TypeScript/ESMをネイティブサポート
- JestライクなAPI（移行が容易）

### Playwright

**定義**: クロスブラウザ対応のE2Eテストフレームワーク。

**公式サイト**: https://playwright.dev/

**本プロジェクトでの用途**:
ユーザーシナリオ全体をテストします。

**バージョン**: 1.x

**選定理由**:
- クロスブラウザ対応（Chrome, Firefox, Safari）
- 並列実行で高速
- デバッグツールが強力

## 略語・頭字語

### MVP

**正式名称**: Minimum Viable Product

**意味**: 最小限の機能を持つ製品。最低限の機能で市場に投入し、フィードバックを得る。

**本プロジェクトでの使用**:
MatrixTaskのMVPは以下の機能を含みます：
- 受信箱、マトリクス、今日やること
- タスクのCRUD操作
- ドラッグ&ドロップ
- ショートカット
- 自然言語入力

フェーズ2以降でタイムライン、ポモドーロ、週次レビューなどを追加予定。

### UI

**正式名称**: User Interface

**意味**: ユーザーインターフェース。ユーザーがシステムと対話する部分。

**本プロジェクトでの使用**:
Reactコンポーネントで実装されたUIレイヤー。`src/components/` に配置。

### CRUD

**正式名称**: Create, Read, Update, Delete

**意味**: データ操作の4つの基本操作。

**本プロジェクトでの使用**:
タスクの作成、読み取り、更新、削除機能。`TaskService` で実装。

### PR

**正式名称**: Pull Request

**意味**: Gitでコードレビューとマージを依頼すること。

**本プロジェクトでの使用**:
feature/fix ブランチから develop ブランチへのマージ時に作成。

### E2E

**正式名称**: End-to-End

**意味**: システム全体を通したテスト。ユーザーの操作フローをテストする。

**本プロジェクトでの使用**:
Playwrightでユーザーシナリオをテスト。`tests/e2e/` に配置。

## アーキテクチャ用語

システム設計・アーキテクチャに関する用語。

### レイヤードアーキテクチャ (Layered Architecture)

**定義**: システムを役割ごとに複数の層に分割し、上位層から下位層への一方向の依存関係を持たせる設計パターン。

**本プロジェクトでの適用**:
4層アーキテクチャを採用しています：

```
components/ (UIレイヤー)
    ↓
stores/ (状態管理レイヤー)
    ↓
services/ (サービスレイヤー)
    ↓
LocalStorage (データレイヤー)
```

**各層の責務**:
- UIレイヤー: ユーザー操作の処理、UIの描画
- 状態管理レイヤー: アプリケーション全体の状態管理
- サービスレイヤー: ビジネスロジックの実装
- データレイヤー: データの永続化と取得

**メリット**:
- 関心の分離による保守性向上
- テストが容易（各層を独立してテスト可能）
- 変更の影響範囲が限定的

**依存関係のルール**:
- ✅ components/ → stores/, services/
- ✅ stores/ → services/
- ✅ services/ → LocalStorage
- ❌ services/ → stores/
- ❌ services/ → components/

**関連ドキュメント**: [アーキテクチャ設計書](./architecture.md#アーキテクチャパターン)

### コンポーネント (Component)

**定義**: Reactの再利用可能なUI部品。独立した機能と見た目を持つ。

**本プロジェクトでの適用**:
全てのUIは関数コンポーネントとして実装されます。

**主要コンポーネント**:
- `InboxBar`: 受信箱コンポーネント
- `MatrixView`: マトリクス表示コンポーネント
- `QuadrantCard`: 象限カードコンポーネント
- `TodayPanel`: 今日やることパネル
- `TaskCard`: タスクカードコンポーネント

**命名規則**: PascalCase

**配置**: `src/components/`

### ストア (Store)

**定義**: Zustandによる状態管理の単位。アプリケーション全体の状態を一元管理する。

**本プロジェクトでの適用**:
`taskStore` がタスク関連の状態とアクションを管理します。

**主要な状態**:
- `tasks: Task[]`: 全タスクリスト
- `isTaskModalOpen: boolean`: タスク詳細モーダルの表示状態
- `selectedTaskId: string | null`: 選択中のタスクID

**主要なアクション**:
- `createTask`: タスク作成
- `updateTask`: タスク更新
- `deleteTask`: タスク削除
- `moveTaskToQuadrant`: タスクを象限に移動
- `pinTaskToToday`: タスクを今日やることにピン留め

**配置**: `src/stores/taskStore.ts`

## ステータス・状態

システム内で使用される各種ステータスの定義。

### 象限 (Quadrant)

| 値 | 意味 | 説明 |
|----|------|------|
| `important-urgent` | 重要×緊急 | 最優先で対応すべきタスク。期限が迫っている重要な作業。 |
| `important-not-urgent` | 重要×緊急でない | 計画的に対応すべきタスク。長期的に重要な作業。 |
| `not-important-urgent` | 重要でない×緊急 | 委任を検討すべきタスク。緊急だが重要度は低い。 |
| `not-important-not-urgent` | 重要でない×緊急でない | 削除を検討すべきタスク。優先度が低い。 |
| `null` | 未分類（受信箱） | まだ分類されていないタスク。受信箱に表示される。 |

**データ型**:
```typescript
type Quadrant =
  | 'important-urgent'
  | 'important-not-urgent'
  | 'not-important-urgent'
  | 'not-important-not-urgent';
```

## データモデル用語

データベース・データ構造に関する用語。

### Task

**定義**: タスクのデータモデル。全てのタスク情報を保持する中心的なエンティティ。

**主要フィールド**:
- `id: string`: UUID v4形式の一意識別子
- `title: string`: タスクのタイトル（1-200文字）
- `description?: string`: タスクの詳細説明（オプション）
- `quadrant: Quadrant | null`: 所属する象限（nullは受信箱）
- `isPinnedToToday: boolean`: 今日やることにピン留めされているか
- `dueDate?: Date`: 期限（オプション）
- `tags: string[]`: タグリスト
- `createdAt: Date`: 作成日時
- `updatedAt: Date`: 更新日時
- `completedAt?: Date`: 完了日時（オプション）

**制約**:
- `id`: 必須、UUID v4形式
- `title`: 必須、1-200文字
- `tags`: 最大10個、各1-50文字

**実装**: `src/types/task.ts`

## エラー・例外

システムで定義されているエラーと例外。

### ValidationError

**クラス名**: `ValidationError`

**発生条件**: ユーザー入力がビジネスルールに違反した場合。

**対処方法**:
- ユーザー: エラーメッセージに従って入力を修正
- 開発者: バリデーションロジックが正しいか確認

**例**:
```typescript
if (title.length === 0) {
  throw new ValidationError(
    'タスクのタイトルを入力してください',
    'title',
    title
  );
}
```

### StorageError

**クラス名**: `StorageError`

**発生条件**: LocalStorageへの保存・読み込みが失敗した場合。

**対処方法**:
- ユーザー: ブラウザのストレージ容量を確認、古いタスクを削除
- 開発者: LocalStorageの容量制限（5MB）を確認

**例**:
```typescript
try {
  localStorage.setItem('matrixtask-data', JSON.stringify(data));
} catch (error) {
  throw new StorageError('データの保存に失敗しました', error);
}
```

## 索引

### あ行
- [アーキテクチャ用語](#アーキテクチャ用語)

### か行
- [コンポーネント](#コンポーネント-component)

### さ行
- [象限](#象限-quadrant)
- [自然言語入力](#自然言語入力-natural-language-input)
- [ストア](#ストア-store)

### た行
- [タスク](#タスク-task)
- [今日やること](#今日やること-today)

### は行
- [ピン留め](#ピン留め-pin)

### ま行
- [マトリクス](#マトリクス-matrix)

### A-Z
- [CRUD](#crud)
- [dnd kit](#dnd-kit)
- [E2E](#e2e)
- [LocalStorage](#localstorage)
- [MVP](#mvp)
- [Playwright](#playwright)
- [PR](#pr)
- [React](#react)
- [Tailwind CSS](#tailwind-css)
- [TypeScript](#typescript)
- [UI](#ui)
- [Vite](#vite)
- [Vitest](#vitest)
- [Zustand](#zustand)
