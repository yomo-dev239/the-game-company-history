'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import Link from 'next/link';
import { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="mb-6 h-full">
        <CardHeader className="flex flex-col gap-4 px-6 pb-0 pt-6">
          <h2 className="text-xl font-bold">{company.name}</h2>
          <p className="text-sm text-gray-500">{company.headquarters}</p>
        </CardHeader>
        <CardBody className="px-6 py-5">
          <p className="line-clamp-5 overflow-hidden text-base">
            {company.description}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
};
