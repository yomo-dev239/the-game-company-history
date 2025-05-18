'use client';

import { useState, useMemo } from 'react';
import { Company } from '@/types/company';
import { CompanyCard } from './CompanyCard';
import { SearchForm } from './SearchForm';

interface CompaniesContentProps {
  initialCompanies: Company[];
}

export function CompaniesContent({ initialCompanies }: CompaniesContentProps) {
  const [filteredCompanies, setFilteredCompanies] =
    useState<Company[]>(initialCompanies);

  // 日本企業と海外企業に分類
  const { japaneseCompanies, foreignCompanies } = useMemo(() => {
    const japanese: Company[] = [];
    const foreign: Company[] = [];

    filteredCompanies.forEach((company) => {
      // 国名が「日本」または未設定の場合は日本企業とみなす
      if (!company.country || company.country === '日本') {
        japanese.push(company);
      } else {
        foreign.push(company);
      }
    });

    return {
      japaneseCompanies: japanese,
      foreignCompanies: foreign,
    };
  }, [filteredCompanies]);

  return (
    <>
      <SearchForm
        companies={initialCompanies}
        onSearch={setFilteredCompanies}
      />

      {filteredCompanies.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          検索条件に一致する会社が見つかりませんでした。
        </p>
      ) : (
        <>
          {/* 日本企業セクション */}
          {japaneseCompanies.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">日本企業</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {japaneseCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* 海外企業セクション */}
          {foreignCompanies.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">海外企業</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {foreignCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
