import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { CheckCircle2, Zap, Code2, Trophy } from 'lucide-react';

const FEATURES = [
  { id: 'feat-problems', icon: <Code2 size={16} />, text: '2,300+ curated DSA problems' },
  { id: 'feat-judge', icon: <Zap size={16} />, text: 'Real-time code execution via Judge0' },
  { id: 'feat-languages', icon: <CheckCircle2 size={16} />, text: '8 languages: C++, Python, Java, JS & more' },
  { id: 'feat-verdicts', icon: <Trophy size={16} />, text: 'Instant verdicts with runtime & memory stats' },
];

const CODE_SNIPPET = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# ✓ Accepted  |  52ms  |  16.4 MB`;

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-zinc-900 border-r border-zinc-800 p-10 xl:p-14 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />
      </div>
      {/* Top: Logo + Tagline */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <AppLogo size={36} />
          <span className="text-2xl font-bold text-zinc-100 tracking-tight">AlgoFirst</span>
        </div>
        <h1 className="text-3xl xl:text-4xl font-bold text-zinc-100 leading-tight mb-3">
          Sharpen your skills.
          <br />
          <span className="text-gradient-blue">Ace the interview.</span>
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed">
          Practice real DSA problems, get instant verdicts, and track your progress from beginner to senior engineer.
        </p>
      </div>
      {/* Code Preview */}
      <div className="relative z-10 my-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-zinc-500 font-mono">two_sum.py</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 leading-relaxed overflow-x-auto">
            <code>
              {CODE_SNIPPET?.split('\n')?.map((line, i) => {
                const isVerdict = line?.startsWith('# ✓');
                return (
                  <div
                    key={`code-line-${i}`}
                    className={isVerdict ? 'text-green-400 mt-2' : ''}
                  >
                    {line || '\u00A0'}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
      {/* Feature List */}
      <div className="relative z-10 space-y-3">
        {FEATURES?.map((feat) => (
          <div key={feat?.id} className="flex items-center gap-3 text-sm">
            <span className="text-blue-400 flex-shrink-0">{feat?.icon}</span>
            <span className="text-zinc-400">{feat?.text}</span>
          </div>
        ))}
      </div>
      {/* Stats Row */}
      <div className="relative z-10 mt-8 pt-8 border-t border-zinc-800 grid grid-cols-3 gap-4">
        {[
          { id: 'stat-problems', value: '2.3K+', label: 'Problems' },
          { id: 'stat-users', value: '180K+', label: 'Developers' },
          { id: 'stat-submissions', value: '4.1M+', label: 'Submissions' },
        ]?.map((stat) => (
          <div key={stat?.id} className="text-center">
            <div className="text-lg font-bold text-zinc-100 tabular-nums">{stat?.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{stat?.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}