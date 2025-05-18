import fs from 'fs';
import path from 'path';
import { Company } from '../types/company';

/**
 * すべての会社データを読み込む
 */
export const getAllCompanies = (): Company[] => {
  const companiesDirectory = path.join(process.cwd(), 'data/companies');
  const fileNames = fs.readdirSync(companiesDirectory);

  const companies = fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(companiesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const company: Company = JSON.parse(fileContents);

      return company;
    });

  return companies;
};

/**
 * 指定されたIDの会社データを取得する
 */
export const getCompanyById = (id: string): Company | null => {
  try {
    const fullPath = path.join(process.cwd(), `data/companies/${id}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error fetching company with ID ${id}:`, error);
    return null;
  }
};

/**
 * すべての会社IDを取得する
 */
export const getAllCompanyIds = (): string[] => {
  const companiesDirectory = path.join(process.cwd(), 'data/companies');
  const fileNames = fs.readdirSync(companiesDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''));
};
