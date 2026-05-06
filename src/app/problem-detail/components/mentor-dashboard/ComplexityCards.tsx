'use client';

import React from 'react';
import { ArrowRightLeft, Cpu, Gauge, TimerReset } from 'lucide-react';
import type { MentorAnalysis } from './types';

interface ComplexityCardsProps {
  analysis: MentorAnalysis;
}

function ComplexityCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-200">
          <Icon size={18} />
        </div>
        <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">{label}</span>
      </div>
      <div className="text-sm font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

export default function ComplexityCards({ analysis }: ComplexityCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <ComplexityCard label="Current Time" value={analysis.complexity.currentTime} icon={TimerReset} />
      <ComplexityCard label="Current Space" value={analysis.complexity.currentSpace} icon={Cpu} />
      <ComplexityCard label="Optimal Time" value={analysis.complexity.optimalTime} icon={ArrowRightLeft} />
      <ComplexityCard label="Optimal Space" value={analysis.complexity.optimalSpace} icon={Gauge} />
    </section>
  );
}