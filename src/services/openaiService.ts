import OpenAI from 'openai';
import {
  ChatCompletionCreateParams,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources/chat/completions';
import { Company } from '../types/company';
import { DeepResearchResult } from '../types/deep-research';

// 関数呼び出し用のJSONスキーマを定義
export const companyUpdateFunction = {
  name: 'update_company_info',
  description: 'ゲーム会社の詳細情報を最新化するための JSON を返す',
  parameters: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: '会社の概要説明（300〜500字程度）',
      },
      established: {
        type: 'string',
        description: '設立年月日（YYYY-MM-DD 形式。分からない場合は YYYY-MM）',
      },
      country: {
        type: 'string',
        description: '本社所在国',
      },
      headquarters: {
        type: 'string',
        description: '本社所在地（都道府県＋市区町村）',
      },
      notableWorks: {
        type: 'array',
        items: { type: 'string' },
        description: '代表作のタイトルリスト',
      },
      history: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            year: { type: 'string', description: '年（YYYY）' },
            event: { type: 'string', description: 'その年の主要な出来事' },
          },
        },
        description: '沿革リスト（年順）',
      },
      website: {
        type: 'string',
        description: '公式サイト URL',
      },
      relatedCompanies: {
        type: 'array',
        items: { type: 'string' },
        description: '関連企業の名前リスト',
      },
    },
    required: ['description', 'notableWorks', 'history'],
  },
} as const;

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Deep Researchを使用して会社情報を取得
 * @param companyName 会社名
 * @param promptTemplate プロンプトテンプレート
 * @param existingData 既存の会社データ
 * @param isNewCompany 新規会社かどうか
 */
export async function performDeepResearch(
  companyName: string,
  promptTemplate: string,
  existingData: Company,
  isNewCompany: boolean = false
): Promise<DeepResearchResult> {
  try {
    // プロンプトの作成
    const prompt = promptTemplate.replace('{{name}}', companyName);

    // 最新の沿革例を取得
    const latestHistory =
      existingData.history.length > 0
        ? `${existingData.history[existingData.history.length - 1]?.year || ''}: ${existingData.history[existingData.history.length - 1]?.event || ''}`
        : '情報なし';

    // コンテキスト作成
    const context = isNewCompany
      ? `
新規登録会社「${companyName}」について、以下の情報をできるだけ正確に取得し、必ず指定された JSON スキーマに則って出力してください。
- 設立年月日
- 本社所在地
- 会社概要（300〜500字程度）
- 代表作リスト
- 沿革（主要な出来事を年順で）
- 公式サイト URL
- 関連企業リスト

出力は必ず純粋な JSON のみとし、余計な説明文や中略を含めないでください。
`
      : `
以下の既存データを参考に、${companyName} の最新情報を取得し、必ず指定の JSON スキーマに則って返してください。
- 設立: ${existingData.established}
- 本社: ${existingData.headquarters}
- 最新沿革例: ${latestHistory}
- 代表作例: ${existingData.notableWorks.join('、')}

もし分からない項目があれば null を設定し、不要なフィールドは出力しないでください。必ず JSON のみを出力してください。
`;

    // System / User メッセージ構築
    const messages: (
      | ChatCompletionSystemMessageParam
      | ChatCompletionUserMessageParam
    )[] = [
      {
        role: 'system' as const,
        content:
          'あなたはゲーム業界に詳しいリサーチャーです。常に最新かつ正確な情報を提供し、出力は必ず関数仕様にラップしてください。',
      },
      { role: 'user' as const, content: `${prompt}\n\n${context}` },
    ];

    // API 呼び出し（Function Calling を指定）
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 利用可能な最新モデル
      messages,
      functions: [companyUpdateFunction as ChatCompletionCreateParams.Function],
      function_call: { name: 'update_company_info' },
      temperature: 0.1,
    });

    // 関数呼び出し結果をパース
    const message = response.choices?.[0]?.message;
    if (!message?.function_call?.arguments) {
      throw new Error('Function call が返ってきませんでした');
    }
    const rawArgs = message.function_call.arguments as string;
    const parsed = JSON.parse(rawArgs) as Partial<Company>;

    return {
      companyInfo: parsed,
      rawResponse: rawArgs,
    };
  } catch (error) {
    console.error('Deep Research実行中にエラー:', error);
    throw error;
  }
}
