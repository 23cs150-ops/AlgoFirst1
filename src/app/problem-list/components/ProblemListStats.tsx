import React from 'react';
import { Problem } from '@/lib/mockData';
import { CheckCircle2 } from 'lucide-react';

interface ProblemListStatsProps {
  problems: Problem[];
  solvedIds: string[];
}

export default function ProblemListStats({ problems, solvedIds }: ProblemListStatsProps) {
  const solved = solvedIds.length;
  const easy = problems.filter((p) => p.difficulty === 'Easy').length;
  const medium = problems.filter((p) => p.difficulty === 'Medium').length;
  const hard = problems.filter((p) => p.difficulty === 'Hard').length;
  const solvedEasy = problems.filter((p) => p.difficulty === 'Easy' && solvedIds.includes(p.id)).length;
  const solvedMedium = problems.filter((p) => p.difficulty === 'Medium' && solvedIds.includes(p.id)).length;
  const solvedHard = problems.filter((p) => p.difficulty === 'Hard' && solvedIds.includes(p.id)).length;

  return (
    <div className="hidden md:flex items-center gap-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-green-400" />
        <span className="text-sm text-zinc-400">
          <span className="text-zinc-100 font-semibold tabular-nums">{solved}</span> solved
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-green-400 tabular-nums font-mono">{solvedEasy}<span className="text-zinc-600">/{easy}</span></span>
        <span className="text-yellow-400 tabular-nums font-mono">{solvedMedium}<span className="text-zinc-600">/{medium}</span></span>
        <span className="text-red-400 tabular-nums font-mono">{solvedHard}<span className="text-zinc-600">/{hard}</span></span>
      </div>
    </div>
  );
}