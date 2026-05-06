'use client';

import React, { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';

interface HintAccordionProps {
  hints: string[];
}

export default function HintAccordion({ hints }: HintAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={16} className="text-amber-300" />
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Progressive Hints</h3>
          <p className="text-xs text-zinc-500">Collapsed by default to preserve the learning flow</p>
        </div>
      </div>

      <div className="space-y-2">
        {hints.map((hint, index) => {
          const isOpen = openIndex === index;
          return (
            <button
              key={`${index}-${hint}`}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-left transition-colors hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-zinc-100">Hint {index + 1}</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              {isOpen && <p className="mt-2 text-sm leading-6 text-zinc-300">{hint}</p>}
            </button>
          );
        })}
      </div>
    </section>
  );
}