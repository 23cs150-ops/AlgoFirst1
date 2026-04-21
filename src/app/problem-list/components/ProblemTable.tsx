'use client';
import React from 'react';
import Link from 'next/link';
import { Problem } from '@/lib/mockData';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import {
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProblemTableProps {
  problems: Problem[];
  solvedIds: string[];
  sortField: 'number' | 'title' | 'difficulty' | 'acceptanceRate';
  sortDir: 'asc' | 'desc';
  onSort: (field: 'number' | 'title' | 'difficulty' | 'acceptanceRate') => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function SortIcon({
  field,
  active,
  dir,
}: {
  field: string;
  active: boolean;
  dir: 'asc' | 'desc';
}) {
  if (!active) return <ChevronsUpDown size={13} className="text-zinc-600 ml-1" />;
  return dir === 'asc' ? (
    <ChevronUp size={13} className="text-blue-400 ml-1" />
  ) : (
    <ChevronDown size={13} className="text-blue-400 ml-1" />
  );
}

export default function ProblemTable({
  problems,
  solvedIds,
  sortField,
  sortDir,
  onSort,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}: ProblemTableProps) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <ChevronsUpDown size={24} className="text-zinc-600" />
        </div>
        <h3 className="text-base font-semibold text-zinc-300 mb-1">No problems match your filters</h3>
        <p className="text-sm text-zinc-500 max-w-xs">
          Try adjusting the difficulty, topic tags, or search query to find problems.
        </p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="w-10 px-4 py-3 text-left">
                <span className="sr-only">Status</span>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer select-none group"
                onClick={() => onSort('number')}
              >
                <div className="flex items-center text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                  #
                  <SortIcon field="number" active={sortField === 'number'} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer select-none group min-w-[240px]"
                onClick={() => onSort('title')}
              >
                <div className="flex items-center text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                  Title
                  <SortIcon field="title" active={sortField === 'title'} dir={sortDir} />
                </div>
              </th>
              <th className="px-4 py-3 text-left min-w-[180px]">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Topics
                </span>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer select-none group"
                onClick={() => onSort('difficulty')}
              >
                <div className="flex items-center text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                  Difficulty
                  <SortIcon field="difficulty" active={sortField === 'difficulty'} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none group"
                onClick={() => onSort('acceptanceRate')}
              >
                <div className="flex items-center justify-end text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                  Acceptance
                  <SortIcon field="acceptanceRate" active={sortField === 'acceptanceRate'} dir={sortDir} />
                </div>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Submissions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {problems.map((problem, idx) => {
              const isSolved = solvedIds.includes(problem.id);
              return (
                <tr
                  key={problem.id}
                  className={`
                    group transition-colors duration-100
                    ${idx % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/30'}
                    hover:bg-zinc-800/60
                  `}
                >
                  {/* Solved Status */}
                  <td className="px-4 py-3">
                    {isSolved ? (
                      <CheckCircle2 size={16} className="text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-700" />
                    )}
                  </td>

                  {/* Number */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-zinc-500 tabular-nums">
                      {problem.number}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/problem-detail?id=${problem.id}`}
                      className="flex items-center gap-2 group/title"
                    >
                      <span className="text-zinc-200 font-medium group-hover/title:text-blue-400 transition-colors">
                        {problem.title}
                      </span>
                      {problem.isPremium && (
                        <Lock size={12} className="text-yellow-500 flex-shrink-0" />
                      )}
                    </Link>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.slice(0, 2).map((tag) => (
                        <span
                          key={`${problem.id}-tag-${tag}`}
                          className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded border border-zinc-700 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 text-zinc-600 text-xs">
                          +{problem.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-3">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>

                  {/* Acceptance Rate */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            problem.acceptanceRate >= 60
                              ? 'bg-green-500'
                              : problem.acceptanceRate >= 40
                              ? 'bg-yellow-500' :'bg-red-500'
                          }`}
                          style={{ width: `${problem.acceptanceRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-zinc-400 tabular-nums w-10 text-right">
                        {problem.acceptanceRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Submissions */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-xs text-zinc-500 tabular-nums">
                      {(problem.totalSubmissions / 1000000).toFixed(1)}M
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <span className="text-xs text-zinc-500 tabular-nums">
          Showing {startItem}–{endItem} of {totalCount} problems
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {getPageNumbers().map((page, i) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-zinc-600 text-sm">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`
                  w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-all duration-100
                  ${currentPage === page
                    ? 'bg-blue-600 text-white' :'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }
                `}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}