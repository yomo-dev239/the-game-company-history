import { getAllCompanies } from '@/utils/company-utils';
import { CompanyCard } from './components/CompanyCard';

export const metadata = {
  title: '会社一覧 | THE ゲーム会社史',
  description:
    '日本および世界のゲーム会社の概要・歴史・代表作などを掲載・整理する情報アーカイブ',
};

export default function CompaniesPage() {
  const companies = getAllCompanies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">ゲーム会社一覧</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {companies.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          データがまだ登録されていません。
        </p>
      )}
    </div>
  );
}
