/**
 * 全会社情報一括更新API
 */
import { NextRequest, NextResponse } from 'next/server';
import { updateAllCompanies } from '@/services/companyUpdater';

export const dynamic = 'force-dynamic'; // キャッシュを無効化

/**
 * 全ての会社情報を更新するAPI
 *
 * リクエスト例:
 * POST /api/companies/update-all
 * { "force": true } // 任意：強制更新フラグ
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストからオプションを取得
    const body = await request.json().catch(() => ({}));
    const { force = false } = body;

    // 全会社情報を更新
    const updatedCompanies = await updateAllCompanies(force);

    return NextResponse.json(
      {
        success: true,
        message: `${updatedCompanies.length}社の情報を更新しました`,
        data: {
          updatedCount: updatedCompanies.length,
          companies: updatedCompanies.map((c) => ({ id: c.id, name: c.name })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('全会社更新APIエラー:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
      },
      { status: 500 }
    );
  }
}

/**
 * Vercel Cronジョブからの呼び出し用
 * GET /api/companies/update-all
 */
export async function GET() {
  try {
    // 全会社情報を更新（強制更新なし）
    const updatedCompanies = await updateAllCompanies(false);

    return NextResponse.json(
      {
        success: true,
        message: `Cronジョブ：${updatedCompanies.length}社の情報を更新しました`,
        data: {
          updatedCount: updatedCompanies.length,
          companies: updatedCompanies.map((c) => ({ id: c.id, name: c.name })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cronジョブエラー:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
