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
    <div className="container mx-auto max-w-screen-xl px-2 py-8">
      <div className="relative mb-8 rounded-xl bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide sm:text-5xl">
          THE ゲーム会社史
        </h1>
      </div>

      <CompaniesContent initialCompanies={allCompanies} />
    </div>
  );
}
