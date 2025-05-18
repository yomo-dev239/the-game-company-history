'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import Link from 'next/link';
import { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const isJapaneseCompany = !company.country || company.country === '日本';

  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="h-full transition-transform hover:scale-105">
        <CardHeader className="flex flex-col gap-2 px-4 pb-0 pt-4">
          <h2 className="line-clamp-1 text-lg font-bold">{company.name}</h2>
          <div className="flex flex-col">
            {!isJapaneseCompany && (
              <span className="text-xs text-gray-500">{company.country}</span>
            )}
            <span className="line-clamp-1 text-xs text-gray-500">
              {company.headquarters}
            </span>
          </div>
        </CardHeader>
        <CardBody className="px-4 py-3">
          <p className="line-clamp-3 overflow-hidden text-sm">
            {company.description}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
};
