'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EdgeCasePanelProps {
  edgeCases: string[];
}

export default function EdgeCasePanel({ edgeCases }: EdgeCasePanelProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="mb-4 flex items-center gap-2">
        <AlertCircle size={16} className="text-rose-300" />
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Edge Cases</h3>
          <p className="text-xs text-zinc-500">Cases to verify before final submission</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {edgeCases.map((edge) => (
          <span key={edge} className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300">
            {edge}
          </span>
        ))}
      </div>
    </section>
  );
}