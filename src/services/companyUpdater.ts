/**
 * 会社情報更新サービス
 */
import fs from 'fs/promises';
import path from 'path';
import { Company } from '../types/company';
import { UpdateConfig, CompanyUpdateConfig } from '../types/update-config';
import { performDeepResearch } from './openaiService';

/**
 * 特定の会社データを更新
 * @param slug 会社スラッグ
 * @returns 更新された会社データ
 */
export async function updateCompanyData(slug: string): Promise<Company> {
  try {
    // 1. 既存データ読み込み
    const filePath = path.join(
      process.cwd(),
      'data',
      'companies',
      `${slug}.json`
    );
    const existingData = JSON.parse(
      await fs.readFile(filePath, 'utf-8')
    ) as Company;

    // 2. 更新設定を読み込み
    const configPath = path.join(process.cwd(), 'data', 'update-config.json');
    const config = JSON.parse(
      await fs.readFile(configPath, 'utf-8')
    ) as UpdateConfig;

    // 3. 会社の設定を取得
    const companyConfig = config.companies.find((c) => c.slug === slug);
    if (!companyConfig) {
      throw new Error(`更新設定に会社「${slug}」が見つかりません`);
    }

    // 4. Deep Research APIを呼び出してデータ取得
    const { companyInfo: updatedData } = await fetchDataFromDeepResearch(
      existingData,
      companyConfig,
      config.deepResearchPromptTemplate
    );

    // 5. 既存データと統合
    const mergedData = mergeCompanyData(existingData, updatedData);

    // 6. ファイル保存
    await fs.writeFile(filePath, JSON.stringify(mergedData, null, 2), 'utf-8');

    // 7. 設定ファイル更新（最終更新日時）
    await updateConfigLastUpdated(slug);

    return mergedData;
  } catch (error) {
    console.error(`会社「${slug}」の更新中にエラーが発生しました:`, error);
    throw new Error(
      `会社「${slug}」の更新中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 全ての会社データを更新する
 * @param forcedUpdate 更新スケジュールを無視して強制的に更新するか
 * @returns 更新された会社データの配列
 */
export async function updateAllCompanies(
  forcedUpdate = false
): Promise<Company[]> {
  try {
    // 1. 更新設定を読み込み
    const configPath = path.join(process.cwd(), 'data', 'update-config.json');
    const config = JSON.parse(
      await fs.readFile(configPath, 'utf-8')
    ) as UpdateConfig;

    // 2. 更新対象の会社を絞り込み
    const companiesToUpdate = forcedUpdate
      ? config.companies
      : filterCompaniesForUpdate(config.companies);

    // 3. 各会社を順番に更新
    const results: Company[] = [];
    for (const company of companiesToUpdate) {
      try {
        const updated = await updateCompanyData(company.slug);
        results.push(updated);

        // API制限を考慮して一定間隔を空ける
        if (companiesToUpdate.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`会社「${company.slug}」の更新に失敗しました:`, error);
        // 1社の失敗で全体が止まらないように続行
      }
    }

    return results;
  } catch (error) {
    console.error('全会社の更新中にエラーが発生しました:', error);
    throw new Error(
      `全会社の更新中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Deep Researchを使用して会社データを取得
 */
async function fetchDataFromDeepResearch(
  company: Company,
  companyConfig: CompanyUpdateConfig,
  promptTemplate: string
): Promise<{ companyInfo: Partial<Company> }> {
  // OpenAI APIを使用してDeep Research実行
  return await performDeepResearch(companyConfig.name, promptTemplate, company);
}

/**
 * 既存データと更新データをマージ
 */
function mergeCompanyData(
  existing: Company,
  updated: Partial<Company>
): Company {
  // 基本情報をマージ
  const merged: Company = {
    ...existing,
    // 更新された情報で上書き
    ...(updated.description && { description: updated.description }),
    ...(updated.headquarters && { headquarters: updated.headquarters }),
    ...(updated.website && { website: updated.website }),
  };

  // 代表作の更新（既存＋新規、重複除去）
  if (updated.notableWorks && updated.notableWorks.length > 0) {
    const allWorks = [...existing.notableWorks, ...updated.notableWorks];
    merged.notableWorks = [...new Set(allWorks)]; // 重複除去
  }

  // 関連会社の更新
  if (updated.relatedCompanies && updated.relatedCompanies.length > 0) {
    const allRelated = [
      ...(existing.relatedCompanies || []),
      ...updated.relatedCompanies,
    ];
    merged.relatedCompanies = [...new Set(allRelated)]; // 重複除去
  }

  // 沿革の更新（既存＋新規、年順にソート）
  if (updated.history && updated.history.length > 0) {
    // 既存の沿革に新しい項目を追加（重複チェック）
    const existingYears = new Set(existing.history.map((h) => h.year));
    const newHistory = updated.history.filter(
      (h) => !existingYears.has(h.year)
    );

    merged.history = [...existing.history, ...newHistory].sort((a, b) =>
      a.year.localeCompare(b.year)
    ); // 年順にソート
  }

  return merged;
}

/**
 * 最終更新日時を更新
 */
async function updateConfigLastUpdated(slug: string): Promise<void> {
  const configPath = path.join(process.cwd(), 'data', 'update-config.json');
  const config = JSON.parse(
    await fs.readFile(configPath, 'utf-8')
  ) as UpdateConfig;

  // 対象会社の最終更新日時を更新
  const companyIndex = config.companies.findIndex((c) => c.slug === slug);
  if (companyIndex !== -1) {
    // nullチェック付きでアクセス
    const company = config.companies[companyIndex];
    if (company) {
      company.lastUpdated = new Date().toISOString();
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  }
}

/**
 * 更新が必要な会社をフィルタリング
 */
function filterCompaniesForUpdate(
  companies: CompanyUpdateConfig[]
): CompanyUpdateConfig[] {
  const now = new Date();

  return companies.filter((company) => {
    const lastUpdated = new Date(company.lastUpdated);
    const daysSinceLastUpdate = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 更新頻度に基づいてフィルタリング
    switch (company.updateFrequency) {
      case 'weekly':
        return daysSinceLastUpdate >= 7;
      case 'monthly':
        return daysSinceLastUpdate >= 30;
      case 'quarterly':
        return daysSinceLastUpdate >= 90;
      case 'yearly':
        return daysSinceLastUpdate >= 365;
      default:
        return false;
    }
  });
}
