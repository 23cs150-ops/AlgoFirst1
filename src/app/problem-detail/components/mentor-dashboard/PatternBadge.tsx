'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface PatternBadgeProps {
  pattern: string;
}

export default function PatternBadge({ pattern }: PatternBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-200 shadow-sm shadow-cyan-950/20">
      <Sparkles size={12} />
      {pattern}
    </span>
  );
}