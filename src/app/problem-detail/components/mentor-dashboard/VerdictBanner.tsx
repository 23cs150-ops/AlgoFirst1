'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, CircleSlash, Clock3, Sparkles } from 'lucide-react';
import PatternBadge from './PatternBadge';
import type { MentorAnalysis } from './types';

interface VerdictBannerProps {
  analysis: MentorAnalysis;
}

function getVerdictTone(verdict: string) {
  if (verdict === 'Accepted') {
    return {
      icon: CheckCircle2,
      gradient: 'from-emerald-500/25 via-emerald-500/12 to-cyan-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-100',
      chip: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20',
    };
  }

  if (verdict === 'Time Limit Exceeded') {
    return {
      icon: Clock3,
      gradient: 'from-amber-500/25 via-amber-500/12 to-orange-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-100',
      chip: 'bg-amber-500/15 text-amber-200 border-amber-500/20',
    };
  }

  if (verdict === 'Runtime Error' || verdict === 'Compilation Error') {
    return {
      icon: CircleSlash,
      gradient: 'from-rose-500/25 via-rose-500/12 to-red-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-100',
      chip: 'bg-rose-500/15 text-rose-200 border-rose-500/20',
    };
  }

  return {
    icon: AlertTriangle,
    gradient: 'from-red-500/25 via-red-500/12 to-orange-500/10',
    border: 'border-red-500/20',
    text: 'text-red-100',
    chip: 'bg-red-500/15 text-red-200 border-red-500/20',
  };
}

export default function VerdictBanner({ analysis }: VerdictBannerProps) {
  const tone = getVerdictTone(analysis.verdict);
  const Icon = tone.icon;

  return (
    <section className={`relative overflow-hidden rounded-3xl border ${tone.border} bg-zinc-950/80 p-4 shadow-2xl shadow-black/25`}> 
      <div className={`absolute inset-0 bg-gradient-to-br ${tone.gradient}`} />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <Icon size={24} className={tone.text} />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`text-lg font-semibold tracking-tight ${tone.text}`}>{analysis.verdict}</h3>
              {analysis.isClose && (
                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                  You are close
                </span>
              )}
            </div>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300">{analysis.rootCause}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone.chip}`}>
                Optimization {analysis.scores.optimization}%
              </span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
                Score {analysis.complexity.efficiencyScore}/100
              </span>
              <PatternBadge pattern={analysis.pattern} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-200">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Pattern Detected</div>
            <div className="text-sm font-semibold text-zinc-100">{analysis.pattern}</div>
          </div>
        </div>
      </div>
    </section>
  );
}