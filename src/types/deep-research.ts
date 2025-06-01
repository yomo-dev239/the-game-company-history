import { Company } from './company';

export interface DeepResearchResult {
  companyInfo: Partial<Company>;
  rawResponse: string;
}
