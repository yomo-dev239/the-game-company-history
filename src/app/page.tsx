import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] place-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex w-full max-w-3xl flex-col items-center gap-[32px] text-center">
        <h1 className="text-4xl font-bold">THE ゲーム会社史</h1>
        <p className="mx-auto text-xl">
          世界のゲーム会社の概要・歴史・代表作などを掲載するサイトです。
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:w-auto sm:px-5 sm:text-base"
            href="/companies"
          >
            会社一覧を見る
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <p>© 2025 THE ゲーム会社史</p>
      </footer>
    </div>
  );
}
