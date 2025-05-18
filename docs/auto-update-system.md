# ゲーム会社情報自動更新システム

「THE ゲーム会社史」では、各ゲーム会社の情報を自動的に最新化するために、OpenAIのAPIを使用したDeep Research機能を実装しています。このドキュメントでは、その仕組みと使い方について説明します。

## 概要

このシステムは以下の機能を提供します：

1. **定期更新**: Vercel Cronジョブを使用して、毎月1日に更新が必要な会社情報を自動的に更新
2. **個別更新**: 特定の会社情報を手動で更新するためのAPI
3. **一括更新**: 全ての会社情報を一括で更新するためのAPI
4. **設定管理**: 会社ごとの更新頻度や優先度を管理する設定ファイル

## 設定ファイル

更新対象の会社リストや更新頻度などの設定は `data/update-config.json` で管理されています。

```json
{
  "companies": [
    {
      "slug": "nintendo",
      "name": "任天堂株式会社",
      "updateFrequency": "monthly",
      "priority": "high",
      "lastUpdated": "2023-05-15T00:00:00Z"
    }
    // 他の会社...
  ],
  "defaultUpdateFrequency": "quarterly",
  "deepResearchPromptTemplate": "以下の会社について最新情報を調査してください: {{name}}。..."
}
```

### 設定項目

- `companies`: 更新対象の会社リスト
  - `slug`: 会社のID（ファイル名と一致）
  - `name`: 会社の正式名称（Deep Research用）
  - `updateFrequency`: 更新頻度（`weekly`, `monthly`, `quarterly`, `yearly`）
  - `priority`: 優先度（`high`, `medium`, `low`）
  - `lastUpdated`: 最終更新日時（ISO形式）
- `defaultUpdateFrequency`: デフォルトの更新頻度
- `deepResearchPromptTemplate`: Deep Research用のプロンプトテンプレート（`{{name}}`は会社名に置換）

## API

### 単一会社の更新

特定の会社情報を更新します。

```
POST /api/companies/update
Content-Type: application/json

{
  "slug": "nintendo"
}
```

### 全会社の一括更新

全ての会社情報を一括で更新します。更新頻度に基づいて更新が必要な会社のみが対象になります。

```
POST /api/companies/update-all
Content-Type: application/json

{
  "force": false  // trueの場合、更新頻度に関わらず全て更新
}
```

### Cronジョブ用エンドポイント

Vercel Cronジョブから呼び出されるエンドポイントです。

```
GET /api/companies/update-all
```

## 環境設定

1. OpenAI APIキーの設定:
   `.env.local` ファイルを作成し、以下の内容を追加します：

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. 依存パッケージのインストール:

   ```
   npm install
   ```

3. Vercel Cronジョブの設定:
   `vercel.json` ファイルに設定済み（毎月1日の00:00に実行）

## 動作の仕組み

1. Cronジョブが定期的に `/api/companies/update-all` を呼び出し
2. 各会社の最終更新日と更新頻度を確認
3. 更新が必要な会社について、OpenAI APIを使用してDeep Research実行
4. 取得した情報と既存情報をマージ
5. 更新されたデータをJSONファイルに保存
6. 最終更新日時を更新

## トラブルシューティング

- **API制限エラー**: OpenAI APIの利用制限に達した場合は、一定時間後に再試行してください
- **更新されない**: `.env.local` ファイルにAPIキーが正しく設定されているか確認してください
- **情報の不正確さ**: `deepResearchPromptTemplate` を調整して、より精度の高い情報を取得できるようにしてください
