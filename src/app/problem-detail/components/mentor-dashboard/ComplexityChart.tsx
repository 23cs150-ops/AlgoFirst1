'use client';

import React from 'react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, RadialBarChart, RadialBar } from 'recharts';
import type { MentorAnalysis } from './types';

interface ComplexityChartProps {
  analysis: MentorAnalysis;
}

const chartData = (analysis: MentorAnalysis) => [
  { metric: 'Time', score: analysis.scores.time },
  { metric: 'Space', score: analysis.scores.space },
  { metric: 'Readability', score: analysis.scores.readability },
  { metric: 'Optimization', score: analysis.scores.optimization },
  { metric: 'Interview', score: analysis.scores.interview },
];

export default function ComplexityChart({ analysis }: ComplexityChartProps) {
  return (
    <section className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-7 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Score Profile</h3>
            <p className="text-xs text-zinc-500">Graph-ready model scores for the submission</p>
          </div>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
            {analysis.complexity.time} / {analysis.complexity.space}
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData(analysis)} outerRadius="72%">
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 16, color: '#e4e4e7' }} />
              <Radar dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.22} dot={{ r: 3 }} animationDuration={1200} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
            Current {analysis.complexity.time}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
            Optimal {analysis.complexity.optimalTime}
          </span>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 min-w-0">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-100">Efficiency Score</h3>
          <p className="text-xs text-zinc-500">How close the current solution is to the desired approach</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ name: 'Efficiency', value: analysis.complexity.efficiencyScore, fill: '#22d3ee' }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={999} background clockWise />
              <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 16, color: '#e4e4e7' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Current score</span>
            <span>{analysis.complexity.efficiencyScore}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-800">
            <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700" style={{ width: `${analysis.complexity.efficiencyScore}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}