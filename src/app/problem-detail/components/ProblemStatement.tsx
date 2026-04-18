'use client';
import React, { useState } from 'react';
import { Problem, Submission } from '@/lib/mockData';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import VerdictBadge from '@/components/ui/VerdictBadge';
import { Copy, Check, ChevronDown, ChevronUp, Clock, Cpu, Tag } from 'lucide-react';

interface ProblemStatementProps {
  problem: Problem;
  submissions: Submission[];
}

const TABS = [
  { id: 'tab-description', label: 'Description' },
  { id: 'tab-submissions', label: 'Submissions' },
];

export default function ProblemStatement({ problem, submissions }: ProblemStatementProps) {
  const [activeTab, setActiveTab] = useState<'tab-description' | 'tab-submissions'>('tab-description');
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

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header Tabs */}
      <div className="flex items-center border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              px-4 py-3 text-sm font-medium transition-all duration-150 border-b-2
              ${activeTab === tab.id
                ? 'text-zinc-100 border-blue-500' :'text-zinc-500 border-transparent hover:text-zinc-300'
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'tab-description' && (
          <div className="p-5 space-y-6">
            {/* Problem Header */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="font-mono text-sm text-zinc-500 tabular-nums mt-0.5">
                  {problem.number}.
                </span>
                <h1 className="text-lg font-bold text-zinc-100 flex-1 leading-tight">
                  {problem.title}
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <DifficultyBadge difficulty={problem.difficulty} size="md" />
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Cpu size={12} />
                  <span className="tabular-nums">
                    {problem.acceptanceRate.toFixed(1)}% acceptance
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Check size={12} />
                  <span className="tabular-nums">
                    {(problem.solvedCount / 1000).toFixed(0)}K solved
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
              {problem.description.split('\n\n').map((para, i) => (
                <p key={`desc-para-${i}`} className="leading-relaxed">
                  {renderMarkdown(para)}
                </p>
              ))}
            </div>

            {/* Examples */}
            <div className="space-y-4">
              {problem.examples.map((ex, i) => (
                <div key={ex.id} className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-300">
                    Example {i + 1}
                  </h3>
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

            {/* Constraints */}
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

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Tag size={12} />
                <span className="uppercase tracking-wider font-medium">Topics</span>
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