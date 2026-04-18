'use client';
import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { DifficultyFilter } from './ProblemListClient';
import { ALL_TAGS } from '@/lib/mockData';

interface ProblemFiltersProps {
  search: string;
  difficulty: DifficultyFilter;
  selectedTags: string[];
  onFilterChange: (search: string, difficulty: DifficultyFilter, tags: string[]) => void;
}

const DIFFICULTY_OPTIONS: DifficultyFilter[] = ['All', 'Easy', 'Medium', 'Hard'];

const DIFFICULTY_STYLES: Record<DifficultyFilter, string> = {
  All: 'text-zinc-300 bg-zinc-800 border-zinc-700',
  Easy: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function ProblemFilters({
  search,
  difficulty,
  selectedTags,
  onFilterChange,
}: ProblemFiltersProps) {
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value, difficulty, selectedTags);
  };

  const handleDifficultyChange = (d: DifficultyFilter) => {
    onFilterChange(search, d, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onFilterChange(search, difficulty, newTags);
  };

  const handleClearAll = () => {
    onFilterChange('', 'All', []);
  };

  const hasFilters = search || difficulty !== 'All' || selectedTags.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search problems..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-blue-500 hover:border-zinc-600 transition-colors"
        />
        {search && (
          <button
            onClick={() => onFilterChange('', difficulty, selectedTags)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Difficulty Tabs */}
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
        {DIFFICULTY_OPTIONS.map((d) => (
          <button
            key={`diff-filter-${d}`}
            onClick={() => handleDifficultyChange(d)}
            className={`
              px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 border
              ${difficulty === d
                ? DIFFICULTY_STYLES[d]
                : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-800'
              }
            `}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Tags Dropdown */}
      <div className="relative">
        <button
          onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-all duration-150
            ${selectedTags.length > 0
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
            }
          `}
        >
          <span>Topics</span>
          {selectedTags.length > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {selectedTags.length}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform duration-150 ${tagDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {tagDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 p-2 fade-in">
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {ALL_TAGS.map((tag) => (
                <button
                  key={`tag-option-${tag}`}
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    px-2 py-1 rounded text-xs font-medium transition-all duration-100 border
                    ${selectedTags.includes(tag)
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear All */}
      {hasFilters && (
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={13} />
          Clear filters
        </button>
      )}

      {/* Active Tag Chips */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <span
              key={`active-tag-${tag}`}
              className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-md"
            >
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="text-blue-400 hover:text-blue-200 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}