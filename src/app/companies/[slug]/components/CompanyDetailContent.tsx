'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import { Company } from '@/types/company';

interface CompanyDetailContentProps {
  company: Company;
  establishedAt: string;
}

export default function CompanyDetailContent({
  company,
  establishedAt,
}: CompanyDetailContentProps) {
  // 会社名の頭文字（ロゴ代替）
  const getInitialFromName = (name: string) => {
    const cleaned = name.replace(
      /^株式会社|^有限会社|^合同会社|^（株）|^（有）|^（同）/,
      ''
    );
    return cleaned.charAt(0).toUpperCase();
  };
  const initial = getInitialFromName(company.name);

  return (
    <>
      {/* ===== ヘッダーセクション ===== */}
      <section className="relative mb-12">
        <div className="absolute inset-0 -z-10 rotate-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-80 shadow-xl"></div>
        <div className="relative flex w-full flex-col gap-4 rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
          <div className="flex items-center gap-5">
            {/* 丸い頭文字アイコン */}
            <div className="flex size-16 items-center justify-center rounded-full bg-indigo-600 text-4xl font-extrabold text-white shadow-inner">
              {initial}
            </div>
            {/* 企業名 */}
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              {company.name}
            </h1>
          </div>

          {/* ヘッダー下のタグ風メタ情報 */}
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
              🌍 {company.country || '国不明'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
              🏢 {company.headquarters}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
              📆 設立：{establishedAt}
            </span>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 underline transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                🔗 公式サイト
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===== 本文セクション ===== */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 左：概要＋沿革 (2カラム分) */}
        <div className="space-y-8 lg:col-span-2">
          {/* 会社概要カード */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="border-b px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                📖 会社概要
              </h2>
            </CardHeader>
            <CardBody className="px-6 py-5">
              <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-200">
                {company.description}
              </p>
            </CardBody>
          </Card>

          {/* 沿革タイムラインカード */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="border-b px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                📜 沿革
              </h2>
            </CardHeader>
            <CardBody className="space-y-4 px-6 py-5">
              {company.history.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  沿革情報はありません。
                </p>
              ) : (
                <div className="relative ml-2">
                  <div className="absolute left-0 h-full w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  {company.history.map((item, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-100">
                        {item.year}
                      </div>
                      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        {item.event}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* 右：代表作＋基本情報 (1カラム分) */}
        <div className="space-y-8">
          {/* 代表作カード */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="border-b px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                🎮 代表作
              </h2>
            </CardHeader>
            <CardBody className="px-6 py-5">
              {company.notableWorks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  代表作は登録されていません。
                </p>
              ) : (
                <ul className="space-y-2 pl-4 text-gray-700 dark:text-gray-200">
                  {company.notableWorks.map((work, idx) => (
                    <li key={idx} className="list-disc">
                      {work}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* 基本情報カード */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="border-b px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                🏢 基本情報
              </h2>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 px-6 py-5">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">設立</p>
                <p className="text-gray-700 dark:text-gray-200">
                  {establishedAt}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  本社所在国
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  {company.country || '不明'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  本社所在地
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  {company.headquarters}
                </p>
              </div>
              {company.relatedCompanies &&
                company.relatedCompanies.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      関連企業
                    </p>
                    <ul className="list-inside list-disc space-y-1 pl-4 text-gray-700 dark:text-gray-200">
                      {company.relatedCompanies.map((rel, i) => (
                        <li key={i}>{rel}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
