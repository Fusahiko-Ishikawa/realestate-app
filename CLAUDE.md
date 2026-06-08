# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run dev      # 開発サーバー起動（localhost:5173）
npm run build    # 本番ビルド（dist/）
npm run preview  # ビルド成果物のプレビュー
npm run lint     # ESLint 実行
```

## アーキテクチャ概要

React + Vite で構成されたシングルページアプリケーション。Supabase を認証バックエンドとして使用する。

### 認証フロー

`AuthContext`（`src/contexts/AuthContext.jsx`）が Supabase セッションをグローバルに管理する。`supabase.auth.onAuthStateChange` で認証状態を購読し、`user` と `loading` を Context 経由でアプリ全体に提供する。

`PrivateRoute`（`src/components/PrivateRoute.jsx`）が認証ガードとして機能する。`loading=true` の間はレンダリングをブロックし、セッション復元前の意図しないリダイレクトを防ぐ。

### ルーティング

`src/App.jsx` で React Router v6 を設定。構造は以下の通り：

- `/` → `/login` にリダイレクト
- `/login` → ログイン画面（公開）
- `/register` → 会員登録画面（公開）
- `/properties` → 物件一覧画面（`PrivateRoute` で保護）

### 環境変数

`.env` に以下の変数を定義し、`.gitignore` でコミット除外済み。Vite の規約により `VITE_` プレフィックスが必要。

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### スタイリング

CSS Modules（`*.module.css`）を採用。グローバルリセットのみ `src/index.css` に記述し、各コンポーネント・ページのスタイルはスコープ分離する。
