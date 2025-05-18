/**
 * OpenAI APIを使用したDeep Research実行サービス
 */
import OpenAI from 'openai';
import { Company } from '../types/company';

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DeepResearchResult {
  companyInfo: Partial<Company>;
  rawResponse: string;
}

/**
 * Deep Researchを使用して会社情報を取得
 * @param companyName 会社名
 * @param promptTemplate プロンプトテンプレート
 * @param existingData 既存の会社データ
 */
export async function performDeepResearch(
  companyName: string,
  promptTemplate: string,
  existingData: Company
): Promise<DeepResearchResult> {
  try {
    // プロンプトの作成
    const prompt =
      promptTemplate.replace('{{name}}', companyName) +
      `\n\n※2025年5月時点の最新情報として記載してください。特に、ここ1〜2年の動向や受賞歴、新作リリースなどがあれば優先的に含めてください。`;

    // 最新の歴史情報を取得（安全なアクセス）
    const latestHistory =
      existingData.history.length > 0
        ? `${existingData.history[existingData.history.length - 1]?.year || '不明'}: ${existingData.history[existingData.history.length - 1]?.event || '不明'}`
        : '情報なし';

    // 既存データの情報をコンテキストとして追加
    const context = `
現在持っている情報:
- 設立: ${existingData.established}
- 本社: ${existingData.headquarters}
- 代表作: ${existingData.notableWorks.join(', ')}
- 最新の歴史情報: ${latestHistory}

この情報をもとに、最新のデータを取得し、以下のJSON形式で返してください:
{
  "description": "会社の最新の概要説明",
  "notableWorks": ["最新の代表作リスト"],
  "history": [
    {"year": "YYYY", "event": "重要な出来事の説明"}
  ],
  "website": "最新の公式サイトURL",
  "relatedCompanies": ["関連会社のリスト"]
}
JSONのrelatedCompaniesは、会社の関連会社のリストであり、子会社のリストではありません。たとえば、任天堂ならゲームフリーク、HAL研究所、インテリジェントシステムズなどが該当します。
    `;

    // OpenAI APIの呼び出し
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // LLM
      messages: [
        {
          role: 'system',
          content:
            'あなたはゲーム業界に詳しい専門調査員です。可能な限り正確で網羅的な最新情報を提供してください。出力は指定されたJSON形式で行ってください。',
        },
        { role: 'user', content: `${prompt}\n\n${context}` },
      ],
      temperature: 0.2, // 低い温度で事実ベースの回答を得る
      response_format: { type: 'json_object' },
    });

    // レスポンスの取得（nullチェック）
    const rawResponse = response.choices?.[0]?.message?.content || '';

    // JSONパース
    const parsedData = JSON.parse(rawResponse) as Partial<Company>;

    return {
      companyInfo: parsedData,
      rawResponse,
    };
  } catch (error) {
    console.error('Deep Research実行中にエラーが発生しました:', error);
    throw new Error(
      `Deep Research実行中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
