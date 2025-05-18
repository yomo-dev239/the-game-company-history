import { getAllCompanies } from '@/utils/company-utils';
import { CompaniesContent } from './components/CompaniesContent';

export const metadata = {
  title: '会社一覧 | THE ゲーム会社史',
  description:
    '日本および世界のゲーム会社の概要・歴史・代表作などを掲載・整理する情報アーカイブ',
};

export default function CompaniesPage() {
  const allCompanies = getAllCompanies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">ゲーム会社一覧</h1>

      <CompaniesContent initialCompanies={allCompanies} />
    </div>
  );
}
