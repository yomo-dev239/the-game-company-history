'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Company } from '@/types/company';
import { CompanyCard } from './CompanyCard';
import { SearchForm } from './SearchForm';

interface CompaniesContentProps {
  initialCompanies: Company[];
}

// 仮の代表作データ型
type FeaturedGame = {
  id: string;
  title: string;
  decade: string;
  description: string;
  companyId: string;
};

export function CompaniesContent({ initialCompanies }: CompaniesContentProps) {
  const [filteredCompanies, setFilteredCompanies] =
    useState<Company[]>(initialCompanies);

  const { japaneseCompanies, foreignCompanies } = useMemo(() => {
    const japanese: Company[] = [];
    const foreign: Company[] = [];

    filteredCompanies.forEach((company) => {
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

  // 注目企業をピックアップ（例として先頭3件を使用）
  const featuredCompanies = filteredCompanies.slice(0, 3);

  // 年代別代表作
  const featuredGames: FeaturedGame[] = [
    {
      id: '1',
      title: 'ドラゴンクエストIII',
      decade: '1980',
      description: 'RPGジャンルの金字塔。ファミコン世代の象徴。',
      companyId: 'square-enix',
    },
    {
      id: '2',
      title: 'スーパーマリオ64',
      decade: '1990',
      description: '3Dアクションゲームの革命的存在。',
      companyId: 'nintendo',
    },
    {
      id: '3',
      title: 'モンスターハンター',
      decade: '2000',
      description: '協力プレイの楽しさを広めたアクションRPG。',
      companyId: 'capcom',
    },
  ];

  return (
    <>
      {/* 注目企業セクション */}
      <section className="mb-10">
        <h2 className="mb-6 border-b pb-2 text-2xl font-semibold">
          🔥 注目の企業
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="flex gap-4 rounded-xl border bg-white p-4 shadow-md transition hover:shadow-lg"
            >
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold text-primary">
                  {company.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {company.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 年代別代表作セクション */}
      <section className="mb-12">
        <h2 className="mb-6 border-b pb-2 text-2xl font-semibold">
          🏆 代表作年代別ピックアップ
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGames.map((game) => (
            <Link
              key={game.id}
              href={`/companies/${game.companyId}`}
              className="block rounded-lg border p-4 shadow transition hover:shadow-md"
            >
              <span className="text-xs">{game.decade}年代</span>
              <h3 className="mt-1 text-lg font-bold text-primary">
                {game.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {game.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <SearchForm
        companies={initialCompanies}
        onSearch={setFilteredCompanies}
      />

      {/* 通常の会社一覧 */}
      {filteredCompanies.length === 0 ? (
        <p className="mt-10 text-center">
          検索条件に一致する会社が見つかりませんでした。
        </p>
      ) : (
        <>
          {japaneseCompanies.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 border-b pb-2 text-2xl font-semibold">
                🇯🇵 日本企業
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {japaneseCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {foreignCompanies.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 border-b pb-2 text-2xl font-semibold">
                🌍 海外企業
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {foreignCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
