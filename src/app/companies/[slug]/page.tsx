import { notFound } from 'next/navigation';
import { getCompanyById } from '@/utils/company-utils';
import { ReturnListButton } from './components/ReturnListButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const { slug } = params;
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
  const params = await props.params;
  const { slug } = params;
  const company = getCompanyById(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReturnListButton />

      <div className="my-4 flex items-center justify-between">
        <h1 className="mr-4 text-3xl font-bold">{company.name}</h1>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-slate-800">
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">基本情報</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-gray-600 dark:text-gray-400">設立</p>
              <p>{company.established}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">本社所在国</p>
              <p>{company.country || '不明'}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">本社所在地</p>
              <p>{company.headquarters}</p>
            </div>
            {company.website && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">公式サイト</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">会社概要</h2>
          <p className="whitespace-pre-line">{company.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">代表作</h2>
          <ul className="list-inside list-disc">
            {company.notableWorks.map((work, index) => (
              <li key={index}>{work}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">沿革</h2>
          <div className="space-y-4">
            {company.history.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-24 font-semibold">{item.year}</div>
                <div>{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
