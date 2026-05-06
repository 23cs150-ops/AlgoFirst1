'use client';

import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import type { MentorAnalysis } from './types';

interface InterviewInsightProps {
  analysis: MentorAnalysis;
}

export default function InterviewInsight({ analysis }: InterviewInsightProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="mb-4 flex items-center gap-2">
        <BriefcaseBusiness size={16} className="text-cyan-300" />
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Interview Insight</h3>
          <p className="text-xs text-zinc-500">What to say in a real interview</p>
        </div>
      </div>
      <p className="text-sm leading-6 text-zinc-300">{analysis.interviewInsight}</p>
    </section>
  );
}