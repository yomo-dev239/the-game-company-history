import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { getJson } from 'serpapi';

interface SearchParams {
  api_key: string;
  q: string;
  gl: string;
  hl: string;
  num: number;
}

interface SearchResult {
  organic_results?: Array<{ link: string }>;
}

const serpClient = {
  json: (params: SearchParams) => getJson(params) as Promise<SearchResult>,
};

export async function fetchSearchUrls(
  query: string,
  numResults = 3
): Promise<string[]> {
  const params: SearchParams = {
    api_key: process.env.SERPAPI_API_KEY || '',
    q: query,
    gl: 'jp',
    hl: 'ja',
    num: numResults,
  };
  const res = await serpClient.json(params);
  const organic = res.organic_results;
  if (!organic) return [];
  return organic
    .map((item) => item.link)
    .filter((link): link is string => typeof link === 'string')
    .slice(0, numResults);
}

/**
 * URL の本文テキストを抽出して返す。
 * - HTML 全体を読むと文字数が多すぎるため、body の最初数千字を返却
 */
export async function scrapeTextFromUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { timeout: 5000 });
    if (!res.ok) return '';
    const html = await res.text();
    const $ = cheerio.load(html);
    // ページ本文を一括テキスト化し、先頭 2000 文字程度に切り詰め
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.slice(0, 2000);
  } catch (error) {
    console.warn(`スクレイピング失敗: ${url}`, error);
    return '';
  }
}
