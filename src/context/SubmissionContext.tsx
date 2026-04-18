'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { MOCK_PROBLEMS, MOCK_SUBMISSIONS, Submission } from '@/lib/mockData';

interface SubmissionContextValue {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt'>) => void;
}

const SubmissionContext = createContext<SubmissionContextValue | undefined>(undefined);

function buildInitialSubmissions(): Submission[] {
  const existingByProblem = new Map<string, Submission[]>();

  for (const sub of MOCK_SUBMISSIONS) {
    const list = existingByProblem.get(sub.problemId) || [];
    list.push(sub);
    existingByProblem.set(sub.problemId, list);
  }

  const generated: Submission[] = [];

  for (const problem of MOCK_PROBLEMS) {
    const current = existingByProblem.get(problem.id) || [];
    const totalForProblem = current.length;

    if (totalForProblem === 0) {
      generated.push(
        {
          id: `seed-${problem.id}-wrong-1`,
          problemId: problem.id,
          language: 'python3',
          status: 'Wrong Answer',
          runtime: '13 ms',
          memory: '12.1 MB',
          submittedAt: '2026-04-18T12:00:00Z',
        },
        {
          id: `seed-${problem.id}-wrong-2`,
          problemId: problem.id,
          language: 'cpp',
          status: 'Runtime Error',
          runtime: 'N/A',
          memory: 'N/A',
          submittedAt: '2026-04-18T11:45:00Z',
        },
      );
    } else if (totalForProblem === 1) {
      generated.push({
        id: `seed-${problem.id}-filler`,
        problemId: problem.id,
        language: 'cpp',
        status: 'Wrong Answer',
        runtime: '11 ms',
        memory: '11.0 MB',
        submittedAt: '2026-04-18T11:45:00Z',
      });
    }
  }

  return [...generated, ...MOCK_SUBMISSIONS].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export function SubmissionProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(() => buildInitialSubmissions());

  const addSubmission = (submission: Omit<Submission, 'id' | 'submittedAt'>) => {
    const now = new Date().toISOString();
    const id = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    setSubmissions((prev) => [
      {
        id,
        submittedAt: now,
        ...submission,
      },
      ...prev,
    ]);
  };

  const value = useMemo(
    () => ({
      submissions,
      addSubmission,
    }),
    [submissions],
  );

  return <SubmissionContext.Provider value={value}>{children}</SubmissionContext.Provider>;
}

export function useSubmissionStore(): SubmissionContextValue {
  const context = useContext(SubmissionContext);

  if (!context) {
    return {
      submissions: buildInitialSubmissions(),
      addSubmission: () => undefined,
    };
  }

  return context;
}
