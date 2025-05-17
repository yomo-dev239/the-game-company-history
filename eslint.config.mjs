import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

// 現在のファイルパスをESMモジュール内で取得するための処理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 従来の設定形式をフラット設定に変換するためのコンパチビリティレイヤーを初期化
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// ESLintの設定配列（フラット設定形式）
const eslintConfig = [
  // 特定のディレクトリをESLintのチェック対象から除外
  {
    ignores: ['**/public/'],
  },
  // 既存の設定を拡張し、フラット設定形式に変換
  ...fixupConfigRules(
    compat.extends(
      // Next.jsのパフォーマンス関連推奨設定
      'next/core-web-vitals',
      // import関連のエラールール
      'plugin:import/errors',
      // TypeScriptのimport設定
      'plugin:import/typescript',
      // import関連の警告ルール
      'plugin:import/warnings',
      // TailwindCSS推奨設定
      'plugin:tailwindcss/recommended',
      // TypeScript推奨設定
      'plugin:@typescript-eslint/recommended'
    )
  ),
  // プロジェクト固有のESLint設定
  {
    // 使用するプラグインを登録
    plugins: {
      // TypeScript用プラグイン
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      // インポート順序などを管理するプラグイン
      import: fixupPluginRules(_import),
      // 未使用インポートを検出するプラグイン
      'unused-imports': unusedImports,
      // Prettierとの連携プラグイン
      prettier,
    },

    // プラグイン固有の設定
    settings: {
      // importプラグインがTypeScriptのパス解決を理解できるようにする設定
      'import/resolver': {
        typescript: {},
      },
    },

    // 個別のルール設定
    rules: {
      // インポート順序のルール - ファイル保存時に自動的にインポート文が整理される
      'import/order': [
        'warn', // 違反時は警告のみ（エラーではない）
        {
          // インポートグループの順序定義
          groups: [
            'builtin', // Node.js組み込みモジュール (fs, path等)
            'external', // npm パッケージ
            'internal', // プロジェクト内の内部モジュール
            'parent', // 親ディレクトリのモジュール (../ で始まる)
            'sibling', // 同じディレクトリのモジュール (./ で始まる)
            'index', // 現在のディレクトリのindex
            'object', // オブジェクトインポート
            'type', // 型のみのインポート
          ],

          // 特定のパターンに一致するインポートのグループと位置を指定
          pathGroups: [
            {
              // Reactとその関連パッケージを最初にインポートするよう設定
              pattern: '{react,react-dom/**,react-router-dom}',
              group: 'builtin', // builtin グループに分類
              position: 'before', // グループの先頭に配置
            },
          ],

          // 特定のインポートタイプをpathGroupsから除外
          pathGroupsExcludedImportTypes: ['builtin'],

          // 各グループ内でアルファベット順にソート
          alphabetize: {
            order: 'asc', // 昇順
            caseInsensitive: true, // 大文字小文字を区別しない
          },
        },
      ],

      // 未使用の変数に警告を出す（TypeScript用）
      '@typescript-eslint/no-unused-vars': 'warn',
      // 未使用のインポートに警告を出す - ファイル保存時に自動的に削除される
      'unused-imports/no-unused-imports': 'warn',
      // React Hooksの依存関係チェックを無効化
      'react-hooks/exhaustive-deps': 'off',
      // var文の使用に警告を出す（let/constを推奨）
      'no-var': 'warn',
      // Prettierのスタイルルール違反に警告を出す
      'prettier/prettier': 'warn',
    },
  },
];

export default eslintConfig;
