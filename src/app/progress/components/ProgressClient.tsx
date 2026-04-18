'use client';
import React, { useState } from 'react';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useSubmissionStore } from '@/context/SubmissionContext';
import VerdictBadge from '@/components/ui/VerdictBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Code2,
  Zap,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';

type StatusFilter = 'All' | 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compilation Error';

const LANGUAGE_LABELS: Record<string, string> = {
  cpp: 'C++',
  python3: 'Python 3',
  java: 'Java',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  go: 'Go',
  rust: 'Rust',
  c: 'C',
};

function formatRelativeTime(isoString: string): string {
  const now = new Date('2026-04-18T15:26:42Z');
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProgressClient() {
  const { submissions: allSubmissions } = useSubmissionStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  // Compute stats
  const solvedProblemIds = [...new Set(allSubmissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId))];
  const totalProblems = MOCK_PROBLEMS.length;
  const solvedCount = solvedProblemIds.length;
  const easyProblems = MOCK_PROBLEMS.filter((p) => p.difficulty === 'Easy');
  const mediumProblems = MOCK_PROBLEMS.filter((p) => p.difficulty === 'Medium');
  const hardProblems = MOCK_PROBLEMS.filter((p) => p.difficulty === 'Hard');
  const solvedEasy = easyProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const solvedMedium = mediumProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const solvedHard = hardProblems.filter((p) => solvedProblemIds.includes(p.id)).length;

  const totalSubmissions = allSubmissions.length;
  const acceptedSubmissions = allSubmissions.filter((s) => s.status === 'Accepted').length;
  const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

  // Filtered submissions
  const filteredSubmissions = statusFilter === 'All'
    ? allSubmissions
    : allSubmissions.filter((s) => s.status === statusFilter);

  // Recent activity: last 5 submissions sorted by date
  const recentActivity = [...allSubmissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getProblemById = (id: string) => MOCK_PROBLEMS.find((p) => p.id === id);

  const statusCounts = {
    Accepted: allSubmissions.filter((s) => s.status === 'Accepted').length,
    'Wrong Answer': allSubmissions.filter((s) => s.status === 'Wrong Answer').length,
    'Runtime Error': allSubmissions.filter((s) => s.status === 'Runtime Error').length,
    'Time Limit Exceeded': allSubmissions.filter((s) => s.status === 'Time Limit Exceeded').length,
    'Compilation Error': allSubmissions.filter((s) => s.status === 'Compilation Error').length,
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4 bg-zinc-900">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-400" />
              My Progress
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Track your solving journey and submission history</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-700">
            <Calendar size={13} />
            <span>Last updated: Apr 18, 2026</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Solved Count */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Solved</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold text-zinc-100 tabular-nums">{solvedCount}</span>
                <span className="text-sm text-zinc-500 mb-1">/ {totalProblems}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(solvedCount / totalProblems) * 100}%` }}
                />
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Acceptance</span>
                <TrendingUp size={16} className="text-blue-400" />
              </div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold text-zinc-100 tabular-nums">{acceptanceRate}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${acceptanceRate}%` }}
                />
              </div>
            </div>

            {/* Total Submissions */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Submissions</span>
                <Code2 size={16} className="text-violet-400" />
              </div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold text-zinc-100 tabular-nums">{totalSubmissions}</span>
                <span className="text-sm text-zinc-500 mb-1">total</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-emerald-400 font-medium">{acceptedSubmissions} AC</span>
                <span className="text-zinc-600">·</span>
                <span className="text-red-400 font-medium">{totalSubmissions - acceptedSubmissions} failed</span>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Streak</span>
                <Zap size={16} className="text-amber-400" />
              </div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold text-zinc-100 tabular-nums">3</span>
                <span className="text-sm text-zinc-500 mb-1">days</span>
              </div>
              <div className="flex gap-1">
                {[true, true, true, false, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full ${active ? 'bg-amber-500' : 'bg-zinc-800'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <BarChart3 size={15} className="text-zinc-500" />
              Difficulty Breakdown
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Easy', solved: solvedEasy, total: easyProblems.length, color: 'text-emerald-400', bar: 'bg-emerald-500', track: 'bg-emerald-500/10' },
                { label: 'Medium', solved: solvedMedium, total: mediumProblems.length, color: 'text-amber-400', bar: 'bg-amber-500', track: 'bg-amber-500/10' },
                { label: 'Hard', solved: solvedHard, total: hardProblems.length, color: 'text-red-400', bar: 'bg-red-500', track: 'bg-red-500/10' },
              ].map(({ label, solved, total, color, bar, track }) => (
                <div key={label} className={`${track} rounded-lg p-4 border border-zinc-800`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${color}`}>{label}</span>
                    <span className="text-xs text-zinc-500 tabular-nums">{solved}/{total}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                    <div
                      className={`${bar} h-2 rounded-full transition-all`}
                      style={{ width: total > 0 ? `${(solved / total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">
                    {total > 0 ? Math.round((solved / total) * 100) : 0}% solved
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <Clock size={15} className="text-zinc-500" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentActivity.map((sub) => {
                const problem = getProblemById(sub.problemId);
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {sub.status === 'Accepted' ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-zinc-200 truncate">
                          {problem ? `${problem.number}. ${problem.title}` : sub.problemId}
                        </span>
                        {problem && <DifficultyBadge difficulty={problem.difficulty} />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                        <span className="font-mono">{LANGUAGE_LABELS[sub.language] ?? sub.language}</span>
                        {sub.runtime !== 'N/A' && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span>{sub.runtime}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <VerdictBadge status={sub.status} />
                      <span className="text-xs text-zinc-600 tabular-nums whitespace-nowrap">
                        {formatRelativeTime(sub.submittedAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Filter size={15} className="text-zinc-500" />
                Submission History
              </h2>
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {(['All', 'Accepted', 'Wrong Answer', 'Runtime Error'] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all border ${
                      statusFilter === s
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :'text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {s === 'All' ? `All (${totalSubmissions})` : `${s} (${statusCounts[s as keyof typeof statusCounts] ?? 0})`}
                  </button>
                ))}
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-sm">No submissions match this filter.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left text-xs font-medium text-zinc-500 pb-2 pr-4">Problem</th>
                      <th className="text-left text-xs font-medium text-zinc-500 pb-2 pr-4">Status</th>
                      <th className="text-left text-xs font-medium text-zinc-500 pb-2 pr-4">Language</th>
                      <th className="text-left text-xs font-medium text-zinc-500 pb-2 pr-4">Runtime</th>
                      <th className="text-left text-xs font-medium text-zinc-500 pb-2 pr-4">Memory</th>
                      <th className="text-left text-xs font-medium text-zinc-500 pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredSubmissions.map((sub) => {
                      const problem = getProblemById(sub.problemId);
                      const isExpanded = expandedSub === sub.id;
                      return (
                        <React.Fragment key={sub.id}>
                          <tr
                            className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                            onClick={() => setExpandedSub(isExpanded ? null : sub.id)}
                          >
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-300 font-medium">
                                  {problem ? `${problem.number}. ${problem.title}` : sub.problemId}
                                </span>
                                {problem && <DifficultyBadge difficulty={problem.difficulty} />}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <VerdictBadge status={sub.status} />
                            </td>
                            <td className="py-3 pr-4">
                              <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                                {LANGUAGE_LABELS[sub.language] ?? sub.language}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-zinc-400 tabular-nums text-xs">{sub.runtime}</span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-zinc-400 tabular-nums text-xs">{sub.memory}</span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-zinc-500 text-xs whitespace-nowrap">{formatDate(sub.submittedAt)}</span>
                                <span className="text-zinc-600">
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="pb-3 pt-0">
                                <div className="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-400 border border-zinc-700/50">
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                      <span className="text-zinc-600 block mb-0.5">Submission ID</span>
                                      <span className="font-mono text-zinc-300">{sub.id}</span>
                                    </div>
                                    <div>
                                      <span className="text-zinc-600 block mb-0.5">Submitted</span>
                                      <span className="text-zinc-300">{formatDate(sub.submittedAt)}</span>
                                    </div>
                                    <div>
                                      <span className="text-zinc-600 block mb-0.5">Runtime</span>
                                      <span className="text-zinc-300">{sub.runtime}</span>
                                    </div>
                                    <div>
                                      <span className="text-zinc-600 block mb-0.5">Memory</span>
                                      <span className="text-zinc-300">{sub.memory}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
