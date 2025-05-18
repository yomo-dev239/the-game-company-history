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

    // 最新の歴史情報を取得（安全なアクセス）
    const latestHistory =
      existingData.history.length > 0
        ? `${existingData.history[existingData.history.length - 1]?.year || '不明'}: ${existingData.history[existingData.history.length - 1]?.event || '不明'}`
        : '情報なし';

    // コンテキスト作成（新規会社の場合は詳細情報リクエスト）
    const context = isNewCompany
      ? `
新規登録会社「${companyName}」について、以下の情報を詳しく調査してください：
- 設立年月日
- 本社所在地
- 会社概要（300〜500字程度）
- 代表作タイトル
- 沿革（主要な出来事）
- 関連会社
- 公式サイトURL

以下のJSON形式で詳細な情報を返してください:
{
  "established": "設立年月日（YYYY-MM-DD形式、日付が不明の場合はYYYY-MM、月も不明の場合はYYYY）",
  "country": "本社所在国",
  "headquarters": "本社所在地",
  "description": "会社の概要説明（300〜500字程度）",
  "notableWorks": ["代表作タイトルのリスト"],
  "history": [
    {"year": "YYYY", "event": "重要な出来事の説明"}
  ],
  "website": "公式サイトURL",
  "relatedCompanies": ["関連会社名のリスト"]
}
`
      : `
現在持っている情報:
- 設立: ${existingData.established}
- 本社: ${existingData.headquarters}
- 代表作: ${existingData.notableWorks.join(', ')}
- 最新の歴史情報: ${latestHistory}

この情報をもとに、最新のデータを取得し、以下のJSON形式で返してください:
{
  "description": "会社の最新の概要説明",
  "established": "設立年月日（YYYY-MM-DD形式が望ましい）",
  "country": "本社所在国",
  "headquarters": "本社所在地",
  "notableWorks": ["最新の代表作リスト"],
  "history": [
    {"year": "YYYY", "event": "重要な出来事の説明"}
  ],
  "website": "最新の公式サイトURL",
  "relatedCompanies": ["関連会社名のリスト"]
}
`;

    // OpenAI APIの呼び出し
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // または利用可能な最新のモデル
      messages: [
        {
          role: 'system',
          content:
            'あなたはゲーム会社に関する正確な最新情報を提供するリサーチ専門家です。情報は常に事実に基づき、出力は指定されたJSON形式で行ってください。',
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
