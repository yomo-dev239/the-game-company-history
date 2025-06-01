import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { getCompanyById } from '@/utils/company-utils';
import CompanyDetailContent from './components/CompanyDetailContent';
import { ReturnListButton } from './components/ReturnListButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async (props: Props) => {
  const { slug } = await props.params;
  const company = getCompanyById(slug);

  if (!company) {
    return {
      title: '会社が見つかりません | THE ゲーム会社史',
      description: '指定された会社の情報は見つかりませんでした。',
    };
  }

  return {
    title: `${company.name} | THE ゲーム会社史`,
    description: company.description.substring(0, 160),
  };
};

export default async function CompanyPage(props: Props) {
  const { slug } = await props.params;
  const company = getCompanyById(slug);

  if (!company) {
    notFound();
  }

  const establishedAt = company.established
    ? format(new Date(company.established), 'yyyy年MM月dd日')
    : '不明';

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <ReturnListButton />
      <CompanyDetailContent company={company} establishedAt={establishedAt} />
    </div>
  );
}
