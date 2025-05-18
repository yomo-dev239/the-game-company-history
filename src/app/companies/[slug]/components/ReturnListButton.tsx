'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export const ReturnListButton = () => {
  return (
    <Button className="mb-6">
      <Link href="/companies">← 一覧に戻る</Link>
    </Button>
  );
};
