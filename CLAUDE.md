# VG流通量ランキングシステム

## プロジェクト概要
ECサイト別（Amazon、楽天、個人所有サイト等）の実写BL（ボーイズラブ）作品のVG（ビデオグラム）流通量を調査し、作品数を基にランキング化するWebアプリケーション。

## 要件定義

### 機能要件

#### 1. 情報収集機能
- Tavily APIを使用したECサイト情報の自動収集
- 実写BL作品のVG（ビデオグラム）に特化した検索
- 以下のECサイトを対象とする：
  - Amazon
  - 楽天市場
  - その他個人・法人運営ECサイト

#### 2. データ分析・ランキング機能
- ECサイト別の作品数集計
- 流通量に基づくランキング表示
- 作品情報の詳細表示（タイトル、価格、在庫状況等）

#### 3. UI/UX機能
- レスポンシブデザイン対応
- インタラクティブなランキング表示
- 検索・フィルタリング機能
- データのビジュアライゼーション

### 非機能要件

#### 1. 認証・セキュリティ
- ログイン機能は**不要**
- パブリックアクセス対応

#### 2. データ管理
- データベースは**不使用**
- データの一時保存は以下の方法を使用：
  - Cookie
  - Session Storage
  - Local Storage

#### 3. パフォーマンス
- 高速な検索・表示機能
- API レスポンス時間の最適化

## 技術スタック

### フロントエンド
- **Next.js 15.3.2** - Reactフレームワーク
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **shadcn/ui** - UIコンポーネントライブラリ
- **Framer Motion** - アニメーション

### 外部API
- **Tavily API** - 情報収集

### 開発ツール
- **ESLint** - コード品質
- **PostCSS** - CSS処理

## 環境設定

### 環境変数
- `TAVILY_API_KEY` - Tavily API アクセスキー

### セットアップ手順
1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
```bash
cp .env.example .env.local
# TAVILY_API_KEYを設定
```

3. 開発サーバーの起動
```bash
npm run dev
```

## ディレクトリ構造
```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusableコンポーネント
│   │   ├── ui/             # shadcn/ui コンポーネント
│   │   ├── ranking/        # ランキング関連コンポーネント
│   │   └── search/         # 検索関連コンポーネント
│   ├── lib/                # ユーティリティ・設定
│   ├── types/              # TypeScript型定義
│   └── utils/              # ヘルパー関数
├── public/                 # 静的ファイル
└── docs/                   # ドキュメント
```

## 開発ガイドライン

### コーディング規約
- TypeScriptの型安全性を最大限活用
- ESLintルールに準拠
- コンポーネントは関数型で記述
- Tailwind CSSを使用してスタイリング

### Git運用
- feature/機能名 のブランチで開発
- プルリクエスト時のコードレビュー必須
- コミットメッセージは日本語で明確に記述

### テスト戦略
- 単体テスト（Jest）
- コンポーネントテスト（React Testing Library）
- E2Eテスト（Playwright）

## API仕様

### Tavily API連携
- 検索クエリ最適化
- レート制限への対応
- エラーハンドリング

### データ構造
```typescript
interface VGRankingData {
  site: string;
  siteUrl: string;
  productCount: number;
  products: VGProduct[];
  lastUpdated: Date;
}

interface VGProduct {
  title: string;
  price: number;
  availability: boolean;
  productUrl: string;
  imageUrl?: string;
}
```

## 今後の拡張予定
- 価格比較機能
- 在庫状況追跡
- 通知機能
- データエクスポート機能
- 多言語対応