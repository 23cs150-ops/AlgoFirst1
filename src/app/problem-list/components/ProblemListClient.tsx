'use client';
import React, { useState, useMemo } from 'react';
import ProblemFilters from './ProblemFilters';
import ProblemTable from './ProblemTable';
import ProblemListStats from './ProblemListStats';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useSubmissionStore } from '@/context/SubmissionContext';

export type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

export default function ProblemListClient() {
  const { submissions: allSubmissions } = useSubmissionStore();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'number' | 'title' | 'difficulty' | 'acceptanceRate'>('number');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  const solvedIds = useMemo(
    () => [...new Set(allSubmissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId))],
    [allSubmissions],
  );

  const filteredProblems = useMemo(() => {
    let result = [...MOCK_PROBLEMS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.number.toString().includes(q)
      );
    }

    if (difficulty !== 'All') {
      result = result.filter((p) => p.difficulty === difficulty);
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.every((tag) => p.tags.includes(tag))
      );
    }

    result.sort((a, b) => {
      let aVal: number | string = a[sortField];
      let bVal: number | string = b[sortField];
      if (sortField === 'difficulty') {
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        aVal = order[a.difficulty];
        bVal = order[b.difficulty];
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, difficulty, selectedTags, sortField, sortDir]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (
    newSearch: string,
    newDifficulty: DifficultyFilter,
    newTags: string[]
  ) => {
    setSearch(newSearch);
    setDifficulty(newDifficulty);
    setSelectedTags(newTags);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Problems</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {filteredProblems.length} problems
              {search || difficulty !== 'All' || selectedTags.length > 0 ? ' (filtered)' : ''}
            </p>
          </div>
          <ProblemListStats problems={MOCK_PROBLEMS} solvedIds={solvedIds} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-3 bg-zinc-900/50">
        <div className="max-w-screen-2xl mx-auto">
          <ProblemFilters
            search={search}
            difficulty={difficulty}
            selectedTags={selectedTags}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-screen-2xl mx-auto">
          <ProblemTable
            problems={paginatedProblems}
            solvedIds={solvedIds}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredProblems.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}