import OpenAI from 'openai';
import { Company } from '../types/company';
import { DeepResearchResult } from '../types/deep-research';
import { scrapeTextFromUrl, fetchSearchUrls } from './retrievalService';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// RAG 用のスキーマ（Function Calling でも可）
export const ragFunction = {
  name: 'rag_update_company_info',
  description: 'RAG により取得したテキストをもとに会社情報を JSON で返す',
  parameters: {
    type: 'object',
    properties: {
      description: { type: 'string', description: '会社概要（300〜500字）' },
      established: {
        type: 'string',
        description: '設立年月日（YYYY-MM-DD 形式）',
      },
      country: { type: 'string', description: '本社所在国' },
      headquarters: { type: 'string', description: '本社所在地' },
      notableWorks: {
        type: 'array',
        items: { type: 'string' },
        description: '代表作リスト',
      },
      history: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            year: { type: 'string' },
            event: { type: 'string' },
          },
        },
        description: '沿革',
      },
      website: { type: 'string', description: '公式サイト URL' },
      relatedCompanies: {
        type: 'array',
        items: { type: 'string' },
        description: '関連企業リスト',
      },
    },
    required: ['description', 'notableWorks', 'history'],
  },
} as const;

/**
 * RAG を用いて会社情報を更新する
 */
export async function performDeepResearchRAG(
  companyName: string,
  existingData: Company,
  isNewCompany: boolean = false
): Promise<DeepResearchResult> {
  // 1. 検索クエリを定義
  const query = `${companyName} 会社 概要 設立 沿革 ニュース サイト`;

  // 2. SerpAPI で検索結果 URL を取得
  const urls = await fetchSearchUrls(query, 3);
  if (urls.length === 0) {
    throw new Error(`${companyName} の検索結果を取得できませんでした`);
  }

  // 3. 各 URL をスクレイピングして生テキストを収集
  const texts: string[] = [];
  for (const url of urls) {
    const txt = await scrapeTextFromUrl(url);
    if (txt) texts.push(txt);
    // サイトに優しいアクセス間隔
    await new Promise((r) => setTimeout(r, 300));
  }
  // 万が一生テキストが取れなければ、エラー
  if (texts.length === 0) {
    throw new Error(`${companyName} の参照用テキストが取得できませんでした`);
  }

  // 4. プロンプト組み立て
  const latestHistory =
    existingData.history.length > 0
      ? `${existingData.history[existingData.history.length - 1]?.year || ''}: ${existingData.history[existingData.history.length - 1]?.event || ''}`
      : '情報なし';

  const context = isNewCompany
    ? `
新規登録会社「${companyName}」について、信頼できるウェブサイト（公式、Wikipedia、ニュース記事等）を参照したテキストを以下に示します。これらをもとに、指定の JSON スキーマに従って出力してください。
`
    : `
以下は既存データの抜粋です：
- 設立: ${existingData.established}
- 本社: ${existingData.headquarters}
- 最新沿革例: ${latestHistory}
- 代表作例: ${existingData.notableWorks.join('、')}

次に示す参照用テキストを基に、${companyName} の最新情報を指定の JSON スキーマで返却してください。
`;

  const prompt = `
${context}

【参照用テキスト（一部抜粋）】
${texts.join('\n\n---\n\n')}

【JSON スキーマ】
{
  "description": "string",
  "established": "string",
  "country": "string",
  "headquarters": "string",
  "notableWorks": ["string"],
  "history": [{"year":"string","event":"string"}],
  "website": "string",
  "relatedCompanies": ["string"]
}

出力は必ず JSON のみで、上記スキーマに従ってください。
`;

  // 5. LLM 呼び出し（Function Calling を活かす例）
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'あなたはゲーム業界リサーチの専門家です。以下のテキストを参照して、JSON スキーマに従った情報を返してください。',
      },
      { role: 'user', content: prompt },
    ],
    functions: [ragFunction],
    function_call: { name: 'rag_update_company_info' },
    temperature: 0.1,
  });

  const message = response.choices?.[0]?.message;
  if (!message || !message.function_call || !message.function_call.arguments) {
    throw new Error('RAG: Function call が返ってきませんでした');
  }
  const rawArgs = message.function_call.arguments;
  if (!rawArgs) {
    throw new Error('RAG: Function の引数が返ってきませんでした');
  }
  const parsed = JSON.parse(rawArgs) as Partial<Company>;

  return {
    companyInfo: parsed,
    rawResponse: rawArgs,
  };
}
