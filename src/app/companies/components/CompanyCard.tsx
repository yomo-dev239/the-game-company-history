'use client';

import { Card, CardBody } from '@heroui/react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  // 「株式会社」など前株を除去して頭文字取得
  const getInitialFromName = (name: string): string => {
    const cleaned = name.replace(
      /^株式会社|^有限会社|^合同会社|^（株）|^（有）|^（同）/,
      ''
    );
    return cleaned.charAt(0).toUpperCase();
  };

  const initial = getInitialFromName(company.name);

  // 設立年（yyyy年）に変換
  const establishedYear = company.established
    ? format(new Date(company.established), 'yyyy年')
    : null;

  const isJapaneseCompany = company.country === '日本';

  return (
    <Link href={`/companies/${company.id}`} className="block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md">
        <div className="flex items-center gap-4 border-b bg-gradient-to-br from-indigo-100 via-white to-white px-4 py-3">
          {/* ロゴ風アイコン */}
          <div className="flex size-12 min-w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-inner">
            {initial}
          </div>

          <div className="flex flex-col overflow-hidden">
            <h2 className="line-clamp-1 font-semibold text-gray-900">
              {company.name}
            </h2>
            <span className="line-clamp-1 text-xs">{company.headquarters}</span>
          </div>
        </div>

        <CardBody className="space-y-2 px-4 py-3">
          <p className="line-clamp-3 text-sm text-gray-700">
            {company.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            {establishedYear && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                設立: {establishedYear}
              </span>
            )}
            {!isJapaneseCompany && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                国: {company.country}
              </span>
            )}
            {company.notableWorks.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                代表作数: {company.notableWorks.length}
              </span>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
