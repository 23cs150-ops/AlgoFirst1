import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProblemListClient from './components/ProblemListClient';

export default function ProblemListPage() {
  return (
    <AppLayout>
      <ProblemListClient />
    </AppLayout>
  );
}