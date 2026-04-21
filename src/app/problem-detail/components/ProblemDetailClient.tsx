'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useSubmissionStore } from '@/context/SubmissionContext';
import ProblemStatement from './ProblemStatement';
import CodeEditorPanel from './CodeEditorPanel';

export default function ProblemDetailClient() {
  const searchParams = useSearchParams();
  const { submissions: allSubmissions } = useSubmissionStore();
  const problemId = searchParams.get('id');
  const problemSlug = searchParams.get('slug');

  const problem =
    MOCK_PROBLEMS.find((item) => item.id === problemId) ||
    MOCK_PROBLEMS.find((item) => item.slug === problemSlug) ||
    MOCK_PROBLEMS[0];

  if (!problem) {
    return (
      <div className="p-6 text-zinc-400">
        No problem found.
      </div>
    );
  }

  const submissions = allSubmissions.filter((submission) => submission.problemId === problem.id);

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r border-zinc-800 min-h-0">
          <ProblemStatement problem={problem} submissions={submissions} />
        </div>
        <div className="min-h-0">
          <CodeEditorPanel problem={problem} />
        </div>
      </div>
    </div>
  );
}
