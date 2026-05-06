'use client';

import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface TestResult {
  id: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  runtime?: string;
}

interface SubmitResultProps {
  verdict: string;
  runtime?: string;
  memory?: string;
  passedCount?: number;
  totalCount?: number;
  testResults?: TestResult[];
}

export default function SubmitResultPanel({ verdict, runtime, memory, passedCount, totalCount, testResults = [] }: SubmitResultProps) {
  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${verdict === 'Accepted' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            {verdict === 'Accepted' ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100">{verdict}</div>
            <div className="text-xs text-zinc-500">{passedCount ?? 0}/{totalCount ?? testResults.length} passed</div>
          </div>
        </div>
        <div className="text-xs text-zinc-400 flex items-center gap-3">
          {runtime && <div className="font-mono">{runtime}</div>}
          {memory && <div className="font-mono">{memory}</div>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {testResults.map((r, i) => (
          <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {r.passed ? <CheckCircle2 size={14} className="text-green-400" /> : <XCircle size={14} className="text-red-400" />}
                <div className="text-xs font-medium">Case {i + 1}</div>
              </div>
              {r.runtime && (
                <div className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={12} /> <span className="font-mono">{r.runtime}</span></div>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-zinc-500">Input</div>
                <pre className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md p-2 mt-1 overflow-x-auto">{r.input}</pre>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Expected</div>
                <pre className="font-mono text-xs text-green-300 bg-green-500/5 border border-green-500/20 rounded-md p-2 mt-1 overflow-x-auto">{r.expected}</pre>
                <div className="text-xs text-zinc-500 mt-2">Your Output</div>
                <pre className={`font-mono text-xs rounded-md p-2 mt-1 overflow-x-auto border ${r.passed ? 'text-green-300 bg-green-500/5 border-green-500/20' : 'text-red-300 bg-red-500/5 border-red-500/20'}`}>{r.actual}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
