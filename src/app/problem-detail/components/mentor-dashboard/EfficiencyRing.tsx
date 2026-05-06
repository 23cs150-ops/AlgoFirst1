'use client';

import React from 'react';
import { ResponsiveContainer, RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import type { MentorAnalysis } from './types';

interface EfficiencyRingProps {
  analysis: MentorAnalysis;
}

export default function EfficiencyRing({ analysis }: EfficiencyRingProps) {
  const data = [{ name: 'Efficiency', value: analysis.complexity.efficiencyScore, fill: '#22d3ee' }];

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Efficiency</h3>
          <p className="text-xs text-zinc-500">Radial score for current solution quality</p>
        </div>
        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
          {analysis.complexity.efficiencyScore}%
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={999} background animationDuration={1200} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}