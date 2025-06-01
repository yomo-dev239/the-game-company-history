/**
 * 会社情報更新設定の型定義
 */

// 更新頻度の定義
export type UpdateFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// 優先度の定義
export type Priority = 'high' | 'medium' | 'low';

// 会社更新設定
export interface CompanyUpdateConfig {
  slug: string; // 会社スラッグ（ファイル名と一致）
  name: string; // 会社名（Deep Research用）
  updateFrequency: UpdateFrequency; // 更新頻度
  priority: Priority; // 優先度
  lastUpdated: string; // 最終更新日時（ISO形式）
  useRAG: boolean; // RAGを使用するかどうか
}

// 更新設定全体
export interface UpdateConfig {
  companies: CompanyUpdateConfig[];
  defaultUpdateFrequency: UpdateFrequency;
  deepResearchPromptTemplate: string;
}
