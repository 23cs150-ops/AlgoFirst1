'use client';
import React, { useState } from 'react';
import { Problem } from '@/lib/mockData';
import { CheckCircle2, XCircle, Loader2, Clock, AlertTriangle } from 'lucide-react';

interface TestResult {
  id: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  runtime?: string;
}

interface RunResult {
  type: 'run' | 'submit';
  verdict: string;
  runtime?: string;
  memory?: string;
  passedCount?: number;
  totalCount?: number;
  testResults?: TestResult[];
  errorMessage?: string;
  stdout?: string;
}

interface TestResultsPanelProps {
  problem: Problem;
  runResult: RunResult | null;
  isLoading: boolean;
  loadingType: 'run' | 'submit' | null;
  errorMessage?: string | null;
}

export default function TestResultsPanel({
  problem,
  runResult,
  isLoading,
  loadingType,
  errorMessage,
}: TestResultsPanelProps) {
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [customInput, setCustomInput] = useState(problem.testCases[0]?.input || '');

  if (!isLoading && errorMessage) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-400">Execution Error</p>
          <p className="text-xs text-zinc-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={20} className="animate-spin text-blue-400" />
          <p className="text-sm text-zinc-400">
            {loadingType === 'submit' ?'Submitting to Judge0 and running all test cases...' :'Running against sample test cases...'}
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`loading-dot-${i}`}
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!runResult) {
    // Show default test case input viewer
    return (
      <div className="h-full flex flex-col bg-zinc-950">
        <div className="flex items-center gap-1 px-3 pt-2 pb-0 border-b border-zinc-800 flex-shrink-0">
          {problem.testCases.slice(0, 3).map((tc, i) => (
            <button
              key={tc.id}
              onClick={() => {
                setActiveTestCase(i);
                setCustomInput(tc.input);
              }}
              className={`
                px-3 py-2 text-xs font-medium border-b-2 transition-all duration-150
                ${activeTestCase === i
                  ? 'text-zinc-100 border-blue-500' :'text-zinc-500 border-transparent hover:text-zinc-300'
                }
              `}
            >
              Case {i + 1}
            </button>
          ))}
          <button
            onClick={() => setActiveTestCase(problem.testCases.length)}
            className={`
              px-3 py-2 text-xs font-medium border-b-2 transition-all duration-150
              ${activeTestCase === problem.testCases.length
                ? 'text-zinc-100 border-blue-500' :'text-zinc-500 border-transparent hover:text-zinc-300'
              }
            `}
          >
            Custom
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeTestCase < problem.testCases.length ? (
            <>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Input
                </label>
                <pre className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md p-2.5 leading-relaxed overflow-x-auto">
                  {problem.testCases[activeTestCase]?.input}
                </pre>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Expected Output
                </label>
                <pre className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md p-2.5 leading-relaxed overflow-x-auto">
                  {problem.testCases[activeTestCase]?.expectedOutput}
                </pre>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                Custom Input
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-md p-2.5 leading-relaxed resize-none outline-none focus:ring-1 focus:ring-blue-500 hover:border-zinc-600 transition-colors"
                placeholder="Enter custom test input..."
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show run/submit results
  const results = runResult.testResults || [];

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Result tabs */}
      <div className="flex items-center gap-1 px-3 pt-2 pb-0 border-b border-zinc-800 flex-shrink-0 overflow-x-auto">
        {results.map((result, i) => (
          <button
            key={result.id}
            onClick={() => setActiveTestCase(i)}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all duration-150 flex-shrink-0
              ${activeTestCase === i
                ? result.passed
                  ? 'text-green-400 border-green-500' :'text-red-400 border-red-500'
                : result.passed
                ? 'text-zinc-500 border-transparent hover:text-green-400' :'text-zinc-500 border-transparent hover:text-red-400'
              }
            `}
          >
            {result.passed ? (
              <CheckCircle2 size={11} className="text-green-400" />
            ) : (
              <XCircle size={11} className="text-red-400" />
            )}
            Case {i + 1}
          </button>
        ))}
      </div>

      {/* Result content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {results[activeTestCase] ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Input
                </label>
                <pre className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md p-2.5 leading-relaxed overflow-x-auto">
                  {results[activeTestCase].input}
                </pre>
              </div>
              <div className="space-y-1">
                {results[activeTestCase].runtime && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                    <Clock size={11} />
                    <span className="font-mono tabular-nums">{results[activeTestCase].runtime}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Expected Output
                </label>
                <pre className="font-mono text-xs text-green-300 bg-green-500/5 border border-green-500/20 rounded-md p-2.5 leading-relaxed overflow-x-auto">
                  {results[activeTestCase].expected}
                </pre>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Your Output
                </label>
                <pre
                  className={`
                    font-mono text-xs rounded-md p-2.5 leading-relaxed overflow-x-auto border
                    ${results[activeTestCase].passed
                      ? 'text-green-300 bg-green-500/5 border-green-500/20' :'text-red-300 bg-red-500/5 border-red-500/20'
                    }
                  `}
                >
                  {results[activeTestCase].actual}
                </pre>
              </div>
            </div>

            {!results[activeTestCase].passed && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-md p-2.5 text-xs text-red-300">
                Output does not match expected. Check your logic for this input case.
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-zinc-500 text-center py-4">
            No result data for this test case.
          </div>
        )}
      </div>
    </div>
  );
}