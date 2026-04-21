import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import ProblemDetailClient from './components/ProblemDetailClient';

export default function ProblemDetailPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6 text-zinc-400">Loading problem...</div>}>
        <ProblemDetailClient />
      </Suspense>
    </AppLayout>
  );
}