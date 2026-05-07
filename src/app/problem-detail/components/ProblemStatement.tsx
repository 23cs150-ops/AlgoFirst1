'use client';
import React, { useMemo, useState } from 'react';
import { Problem, Submission } from '@/lib/mockData';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import VerdictBadge from '@/components/ui/VerdictBadge';
import { Copy, Check, ChevronDown, ChevronUp, Clock, Cpu, Tag, Sparkles, X } from 'lucide-react';
import type { MentorAnalysis } from './mentor-dashboard/types';
import MentorDashboard from './mentor-dashboard/MentorDashboard';

interface ProblemStatementProps {
  problem: Problem;
  submissions: Submission[];
  insightsAnalysis?: MentorAnalysis | null;
}

const BASE_TABS = [
  { id: 'tab-description', label: 'Description' },
  { id: 'tab-submissions', label: 'Submissions' },
];

export default function ProblemStatement({ problem, submissions, insightsAnalysis }: ProblemStatementProps) {
  const hasInsights = Boolean(insightsAnalysis);
  const tabs = useMemo(
    () => [...BASE_TABS, ...(hasInsights ? [{ id: 'tab-insights', label: 'Insights' }] : [])],
    [hasInsights],
  );
  const [activeTab, setActiveTab] = useState<'tab-description' | 'tab-submissions' | 'tab-insights'>('tab-description');
  const [showInsightsPanel, setShowInsightsPanel] = useState(true);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);
  const [expandedConstraints, setExpandedConstraints] = useState(false);

  const handleCopyExample = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const renderMarkdown = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={`md-code-${i}`} className="font-mono text-blue-300 bg-zinc-800 px-1 py-0.5 rounded text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`md-bold-${i}`} className="text-zinc-100 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={`md-em-${i}`} className="text-zinc-300 italic">{part.slice(1, -1)}</em>;
      }
      return <span key={`md-text-${i}`}>{part}</span>;
    });
  };

  const educationalHints = useMemo(() => {
    const topTags = problem.tags.slice(0, 3).join(', ');
    const baseHints = [
      'Start with a brute-force model, then reduce repeated work step by step.',
      'Check the constraints carefully for a signal about the intended time complexity.',
      topTags ? `Common patterns for this problem include ${topTags}.` : 'Look for the core invariant and the smallest useful state.',
    ];
    const interviewNote = `Explain the tradeoff between clarity and efficiency, and mention why the chosen approach fits the constraints for a ${problem.difficulty.toLowerCase()} problem.`;
    return { baseHints, interviewNote };
  }, [problem.difficulty, problem.tags]);

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              if (tab.id === 'tab-insights') {
                setShowInsightsPanel(true);
              }
            }}
            className={`
              px-4 py-3 text-sm font-medium transition-all duration-150 border-b-2
              ${activeTab === tab.id
                ? 'text-zinc-100 border-blue-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }
            `}
          >
            {tab.label}
            {tab.id === 'tab-submissions' && submissions.length > 0 && (
              <span className="ml-1.5 text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md tabular-nums">
                {submissions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'tab-description' && (
          <div className="p-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="font-mono text-sm text-zinc-500 tabular-nums mt-0.5">{problem.number}.</span>
                <h1 className="text-lg font-bold text-zinc-100 flex-1 leading-tight">{problem.title}</h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <DifficultyBadge difficulty={problem.difficulty} size="md" />
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Cpu size={12} />
                  <span className="tabular-nums">{problem.acceptanceRate.toFixed(1)}% acceptance</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Check size={12} />
                  <span className="tabular-nums">{(problem.solvedCount / 1000).toFixed(0)}K solved</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
              {problem.description.split('\n\n').map((para, i) => (
                <p key={`desc-para-${i}`} className="leading-relaxed">
                  {renderMarkdown(para)}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              {problem.examples.map((ex, i) => (
                <div key={ex.id} className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-300">Example {i + 1}</h3>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-zinc-500 font-mono w-14 flex-shrink-0 mt-0.5">Input:</span>
                        <div className="flex-1 flex items-start justify-between gap-2">
                          <code className="text-xs font-mono text-zinc-200 flex-1">{ex.input}</code>
                          <button
                            onClick={() => handleCopyExample(`${ex.id}-in`, ex.input)}
                            className="flex-shrink-0 p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                            aria-label="Copy input"
                          >
                            {copiedExample === `${ex.id}-in` ? (
                              <Check size={12} className="text-green-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-zinc-500 font-mono w-14 flex-shrink-0 mt-0.5">Output:</span>
                        <code className="text-xs font-mono text-zinc-200">{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <div className="flex items-start gap-2 pt-1 border-t border-zinc-800">
                          <span className="text-xs text-zinc-500 font-mono w-14 flex-shrink-0 mt-0.5">Explain:</span>
                          <p className="text-xs text-zinc-400 leading-relaxed">{ex.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setExpandedConstraints(!expandedConstraints)}
                className="flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Constraints
                {expandedConstraints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expandedConstraints && (
                <ul className="space-y-1.5 fade-in">
                  {problem.constraints.map((c, i) => (
                    <li key={`constraint-${i}`} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="text-zinc-600 mt-0.5 flex-shrink-0">•</span>
                      <code className="font-mono leading-relaxed">{c}</code>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <Sparkles size={14} className="text-cyan-300" />
                Study Guide
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Hints</div>
                  <ul className="space-y-1.5 text-sm text-zinc-300 leading-6">
                    {educationalHints.baseHints.map((hint, index) => (
                      <li key={`hint-${index}`} className="flex gap-2">
                        <span className="text-zinc-600">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Interview</div>
                  <p className="text-sm text-zinc-300 leading-6">{educationalHints.interviewNote}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500 mb-2">
                    <Tag size={12} />
                    Topics
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags.map((tag) => (
                      <span
                        key={`detail-tag-${tag}`}
                        className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs rounded-md font-medium hover:border-zinc-600 hover:text-zinc-200 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tab-insights' && hasInsights && insightsAnalysis && (
          <div className="h-full min-h-0 overflow-hidden p-4">
            {showInsightsPanel ? (
              <div className="h-full min-h-0 flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950/80 overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">Submission Insights</h3>
                    <p className="text-xs text-zinc-500">Full mentor dashboard for your submitted solution</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInsightsPanel(false)}
                    className="rounded-full border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
                    aria-label="Close insights panel"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <MentorDashboard analysis={insightsAnalysis} />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-100">Insights panel closed</p>
                  <p className="text-xs text-zinc-500">Click the Insights tab again to reopen submission analysis.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tab-submissions' && (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">Recent Submissions</h3>
            {submissions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-zinc-500">No submissions yet for this problem.</p>
                <p className="text-xs text-zinc-600 mt-1">Write your solution and click Submit.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <VerdictBadge status={sub.status} size="sm" />
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="font-mono">{sub.language}</span>
                        {sub.runtime !== 'N/A' && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {sub.runtime}
                          </span>
                        )}
                        {sub.memory !== 'N/A' && (
                          <span className="flex items-center gap-1">
                            <Cpu size={11} />
                            {sub.memory}
                          </span>
                        )}
                        <span className="text-zinc-600">
                          {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}