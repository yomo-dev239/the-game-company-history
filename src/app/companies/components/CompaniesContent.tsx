'use client';

import { useState } from 'react';
import { Company } from '@/types/company';
import { CompanyCard } from './CompanyCard';
import { SearchForm } from './SearchForm';

interface CompaniesContentProps {
  initialCompanies: Company[];
}

export function CompaniesContent({ initialCompanies }: CompaniesContentProps) {
  const [filteredCompanies, setFilteredCompanies] =
    useState<Company[]>(initialCompanies);

  return (
    <>
      <SearchForm
        companies={initialCompanies}
        onSearch={setFilteredCompanies}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          検索条件に一致する会社が見つかりませんでした。
        </p>
      )}
    </>
  );
}
