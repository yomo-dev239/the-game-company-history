/**
 * 会社情報更新API
 */
import { NextRequest, NextResponse } from 'next/server';
import { updateCompanyData } from '@/services/companyUpdater';

export const dynamic = 'force-dynamic'; // キャッシュを無効化

/**
 * 特定の会社情報を更新するAPI
 *
 * リクエスト例:
 * POST /api/companies/update
 * { "slug": "nintendo" }
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストからスラッグを取得
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'スラッグが指定されていません' },
        { status: 400 }
      );
    }

    // 会社情報を更新
    const updatedCompany = await updateCompanyData(slug);

    return NextResponse.json(
      {
        success: true,
        message: `会社「${updatedCompany.name}」の情報を更新しました`,
        data: updatedCompany,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('会社更新APIエラー:', error);

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
