'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export const ReturnListButton = () => {
  return (
    <Link href="/companies">
      <Button className="mb-6">← 一覧に戻る</Button>
    </Link>
  );
};
