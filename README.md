# MatrixTask - アイゼンハワーマトリクスTodoアプリ

本リポジトリは技術評論社より発行されている[「実践Claude Code入門 - 現場で活用するためのAIコーディングの思考法」](https://www.amazon.co.jp/dp/4297153548)のサンプルコードを管理するGitHubリポジトリです。

リポジトリ内のコード・プロンプトに関する詳細な解説は、書籍をご覧ください。

## プロジェクト概要

**MatrixTask**は、アイゼンハワーマトリクスによる行動指向Todoアプリです。タスクを重要度と緊急度で分類し、「今日やること」に集中できる設計になっています。

### 主な特徴

- **受信箱**: まず受信箱にタスクを追加し、後で分類
- **マトリクス表示**: 4象限（重要×緊急、重要×緊急でない、重要でない×緊急、重要でない×緊急でない）でタスクを整理
- **今日やること**: マトリクスから「今日やること」にピン留めして実行に集中
- **自然言語入力**: 「明日までにレポート #重要」のような自然な入力をサポート
- **インライン編集**: タスクカード上でダブルクリックして直接タイトルを編集可能
- **Turso Database**: クラウドベースのSQLiteデータベースで永続的にデータを保存

## 技術スタック

- **言語**: TypeScript 5.x
- **フレームワーク**: React 18.x
- **ビルドツール**: Vite 5.x
- **状態管理**: Zustand 4.x
- **データベース**: Turso (SQLite on the Edge)
- **ドラッグ&ドロップ**: @dnd-kit 6.x
- **スタイリング**: Tailwind CSS 3.x
- **日付処理**: date-fns 3.x
- **テスト**: Vitest 2.x

## セットアップ

### 1. リポジトリのクローン

```bash
git clone [このリポジトリ] claude-code-book-chapter8
cd claude-code-book-chapter8
```

### 2. Dev Container経由で開く（推奨）

Visual Studio Codeで「Reopen in Container」を選択すると、自動的に次のように環境構築が行われます。

- Node.js v24.11.0環境の構築
- npm installの実行
- Claude Codeの最新版インストール

※ Dev Containerを利用する際は、事前にDockerのインストールが必要です。

### 3. Tursoデータベースのセットアップ

このアプリはTurso (SQLite on the Edge) を使用してデータを保存します。

```bash
# Turso CLIをインストール (macOS/Linux)
curl -sSfL https://get.tur.so/install.sh | bash
# インストール後、新しいターミナルを開くか、以下を実行
source ~/.zshrc  # または source ~/.bashrc

# Tursoアカウントにログイン
turso auth login

# データベースを作成
turso db create matrixtask

# データベースURLを取得
turso db show matrixtask --url

# 認証トークンを作成
turso db tokens create matrixtask

# データベーススキーマを作成
turso db shell matrixtask < schema.sql
```

### 4. 環境変数の設定

`.env.example`を`.env`にコピーし、Tursoの接続情報を設定してください。

```bash
# .env.exampleをコピー
cp .env.example .env

# .envファイルを編集して以下の値を設定
# VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
# VITE_TURSO_AUTH_TOKEN=your-auth-token-here
```

### 5. ローカル環境でのセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

## 開発コマンド

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run typecheck

# リント
npm run lint

# フォーマット
npm run format

# テスト
npm test

# テスト（watch モード）
npm run test:watch
```

## プロジェクト構造

```
src/
├── components/      # Reactコンポーネント
├── stores/          # Zustand状態管理
├── services/        # ビジネスロジック
├── types/           # TypeScript型定義
├── utils/           # ユーティリティ関数
├── App.tsx          # メインアプリ
├── main.tsx         # エントリーポイント
└── index.css        # グローバルスタイル

docs/                # 永続ドキュメント
├── product-requirements.md
├── functional-design.md
├── architecture.md
├── repository-structure.md
├── development-guidelines.md
└── glossary.md

.steering/           # 作業単位のドキュメント
```

## 実装状況

### ✅ 完了

- プロジェクトセットアップ（依存関係、Vite、Tailwind CSS）
- データモデルと型定義（Task、Quadrant、AppState）
- サービスレイヤー（TaskService、StorageService、NaturalLanguageParser）
- 状態管理レイヤー（Zustand store）
- 基本レイアウト（App.tsx）
- 詳細なUIコンポーネント（TaskCard、InboxBar、MatrixView、TodayPanel、TaskDetailModal等）
- ドラッグ&ドロップ機能（@dnd-kit使用、受信箱⇔マトリクス⇔今日やること）
- 品質チェック（型チェック、リント、ビルド、テスト）

### 🚧 未完了（次フェーズで実装予定）

- 包括的なテストスイート

## 注意事項

本リポジトリの内容は読者からのフィードバックを受けて、より性能の良いプロンプトに変更されることがあります。差分は随時書籍に反映されますが、お手元の版との差分があることをご承知おきください。

## フィードバック

書籍の内容に関するご質問、不備のご指摘については以下のリポジトリのイシューよりお願いいたします。

https://github.com/GenerativeAgents/claude-code-book
