'use client';

import React from 'react';
import type { MentorAnalysis } from './types';
import VerdictBanner from './VerdictBanner';
import ComplexityCards from './ComplexityCards';
import ComplexityChart from './ComplexityChart';
import VisualizationPanel from './VisualizationPanel';
import HintAccordion from './HintAccordion';
import EdgeCasePanel from './EdgeCasePanel';
import InterviewInsight from './InterviewInsight';

interface MentorDashboardProps {
  analysis: MentorAnalysis;
}

export default function MentorDashboard({ analysis }: MentorDashboardProps) {
  return (
    <div className="space-y-4">
      <VerdictBanner analysis={analysis} />
      <ComplexityCards analysis={analysis} />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 min-w-0">
          <ComplexityChart analysis={analysis} />
        </div>
        <div className="col-span-12 xl:col-span-4 min-w-0">
          <VisualizationPanel analysis={analysis} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6 min-w-0">
          <HintAccordion hints={analysis.hints} />
        </div>
        <div className="col-span-12 xl:col-span-6 min-w-0">
          <EdgeCasePanel edgeCases={analysis.edgeCases} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 min-w-0">
          <InterviewInsight analysis={analysis} />
        </div>
      </div>
    </div>
  );
}