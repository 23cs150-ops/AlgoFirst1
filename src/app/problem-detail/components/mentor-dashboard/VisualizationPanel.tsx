'use client';

import React from 'react';
import { ArrowRight, GitBranch, Layers3 } from 'lucide-react';
import type { MentorAnalysis } from './types';

interface VisualizationPanelProps {
  analysis: MentorAnalysis;
}

export default function VisualizationPanel({ analysis }: VisualizationPanelProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Layers3 size={16} className="text-cyan-300" />
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Visualization Timeline</h3>
          <p className="text-xs text-zinc-500">Compact step-by-step state progression</p>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.visualization.map((step, index) => (
          <div
            key={`${step.step}-${step.action}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/25"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-200">
                  <GitBranch size={16} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Step {step.step}</div>
                  <div className="mt-1 text-sm font-medium text-zinc-100">{step.action}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(step.state).map(([key, value]) => (
                  <span key={key} className="rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300">
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>
            {index < analysis.visualization.length - 1 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                <ArrowRight size={12} /> Next step
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}