# DevTools Registry

開発環境・CLIツール・ライブラリなどのインストール方法や使い方を記録するWebアプリ

## 特徴

- 📝 ツールごとにOS別のインストール方法を記録
- 💻 よく使うコマンド・Usageを登録
- 🏷️ タグやカテゴリで分類・検索
- 💾 SQLiteで永続化
- 📥 JSON形式でエクスポート/インポート可能
- 🌙 ダークモード対応
- 🔐 GitHub/Google OAuth認証（閲覧はPublic、編集は認証必要）
- 🔗 Permalink対応（`/tools/[slug]`）
- 🌐 OGP/Twitter Card対応
- 📤 SNSシェアボタン（X, Facebook, はてなブックマーク, URL copy）
- 📝 Markdown対応（description, configNotes, tips, notes）
- 📊 Google Tag Manager (GTM) 対応
- 🐳 Docker対応

## クイックスタート

### Docker（推奨）
```bash
git clone https://github.com/tokifujp/devtools-registry.git
cd devtools-registry

# データディレクトリ作成と権限設定
mkdir data
chmod 777 data

# DBファイル初期化（sqlite3が必要）
# Ubuntu/Debian: sudo apt install sqlite3
# macOS: brew install sqlite3
touch data/dev.db
sqlite3 data/dev.db < prisma/migrations/20240315000000_init/migration.sql
sqlite3 data/dev.db < prisma/migrations/20260316000000_add_slug/migration.sql

# 環境変数設定
cp .env.local.example .env
# .envファイルを編集してOAuth情報を設定

# 起動
docker compose up -d
```

ブラウザで `http://localhost:3002` を開く

### ローカル開発
```bash
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.localファイルを編集

# DB初期化
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 環境変数

### 必須
```env
DATABASE_URL="file:./data/dev.db"
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=（openssl rand -base64 32で生成）
```

### OAuth認証

#### NEXTAUTH_SECRET生成
```bash
openssl rand -base64 32
```

生成された文字列を `.env` の `NEXTAUTH_SECRET` に設定

#### GitHub OAuth設定

1. https://github.com/settings/developers にアクセス
2. "New OAuth App" をクリック
3. 以下を設定：
   - Application name: `DevTools Registry`
   - Homepage URL: `https://your-domain.com` (本番) または `http://localhost:3002` (開発)
   - Authorization callback URL: `https://your-domain.com/api/auth/callback/github` (本番) または `http://localhost:3002/api/auth/callback/github` (開発)
4. "Register application" をクリック
5. Client IDをコピーして `.env` の `GITHUB_ID` に設定
6. "Generate a new client secret" をクリック
7. Client secretをコピーして `.env` の `GITHUB_SECRET` に設定

#### Google OAuth設定

1. https://console.cloud.google.com/ にアクセス
2. プロジェクトを作成または選択
3. 「APIとサービス」→「認証情報」へ移動
4. 「OAuth同意画面」を設定（外部ユーザー、アプリ名など）
5. 「認証情報を作成」→「OAuthクライアントID」を選択
6. アプリケーションの種類: `ウェブアプリケーション`
7. 承認済みのリダイレクトURIに追加:
   - `https://your-domain.com/api/auth/callback/google` (本番)
   - `http://localhost:3002/api/auth/callback/google` (開発)
8. クライアントIDを `.env` の `GOOGLE_ID` に設定
9. クライアントシークレットを `.env` の `GOOGLE_SECRET` に設定

#### メールアドレス制限

特定のユーザーだけに編集権限を付与できます。

`.env` に許可するメールアドレスを設定：
```env
# 単一のメールアドレス
ALLOWED_EMAILS=your-email@gmail.com

# 複数のメールアドレス（カンマ区切り）
ALLOWED_EMAILS=user1@gmail.com,user2@example.com,user3@company.com
```

**注意:**
- `ALLOWED_EMAILS` が空の場合、すべてのOAuthユーザーがログインできます（開発用）
- 本番環境では必ず設定することを推奨
- GitHub/Google どちらの認証方法でも、このメールアドレスでチェックされます

### オプション

#### Google Tag Manager (GTM)
```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

GTMコンテナIDを設定すると、Google Tag Managerが自動的に埋め込まれます。
設定しない場合は何も読み込まれません。

## 機能

### 閲覧（認証不要）

- すべてのツール情報を自由に閲覧可能
- 検索機能も利用可能
- Permalink経由でのアクセス（`/tools/[slug]`）
- SNSシェア機能

### ツール登録・編集・削除（認証必要）

1. 右上の「ログイン」ボタンをクリック
2. GitHub または Google でログイン
3. 「ツール追加」ボタンから登録
4. 基本情報を入力（名前、カテゴリ、タグなど）
5. OS別のインストール情報を追加
6. よく使うコマンドやTipsを記録
7. 保存

### Markdown対応

以下のフィールドでMarkdown記法が使用できます：
- 概要・用途（description）
- 設定方法（configNotes）
- 備考（Installation notes）
- Tips・小ネタ（tips）
- メモ（notes）

サポートされるMarkdown記法：
- 見出し（`#`, `##`, `###`）
- **太字**、*イタリック*
- リスト（`-`, `1.`）
- リンク（`[text](url)`）
- インラインコード（`` `code` ``）
- コードブロック（` ``` `）
- テーブル（GitHub Flavored Markdown）

### データ管理

- **エクスポート**: 全データをJSON形式でダウンロード（認証不要）
- **インポート**: 以前エクスポートしたJSONファイルを読み込み（認証必要）

### 検索

ツール名、カテゴリ、タグ、OS名、説明文で検索可能

### ダークモード

右上のアイコンで切り替え可能

## Docker管理
```bash
# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f

# 再ビルド
docker compose up -d --build
```

## データの永続化

`./data/dev.db` にSQLiteデータベースが保存されます。このディレクトリをバックアップしてください。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (ダークモード対応)
- Prisma + SQLite
- NextAuth.js (GitHub/Google OAuth)
- react-markdown + remark-gfm (Markdown rendering)
- @tailwindcss/typography (Markdown styling)
- Docker / Docker Compose

## ライセンス

MIT