'use client';

import React, { useMemo, useState } from 'react';
import { MOCK_PROBLEMS, Problem } from '@/lib/mockData';
import DifficultyBadge from '@/components/ui/DifficultyBadge';

type TopicConfig = {
  key: string;
  label: string;
  tags: string[];
};

const TOPICS: TopicConfig[] = [
  { key: 'dynamic-programming', label: 'Dynamic Programming', tags: ['Dynamic Programming'] },
  { key: 'arrays', label: 'Arrays', tags: ['Array'] },
  { key: 'stacks', label: 'Stacks', tags: ['Stack'] },
  { key: 'sliding-window', label: 'Sliding Window', tags: ['Sliding Window'] },
  { key: 'two-pointers', label: 'Two Pointers', tags: ['Two Pointers'] },
  { key: 'linked-list', label: 'Linked List', tags: ['Linked List'] },
  { key: 'binary-search', label: 'Binary Search', tags: ['Binary Search'] },
  { key: 'tree-graph', label: 'Trees / Graph', tags: ['Tree', 'Graph', 'Depth-First Search', 'Breadth-First Search'] },
];

function getProblemsForTopic(topic: TopicConfig, problems: Problem[]): Problem[] {
  const tagSet = new Set(topic.tags.map((tag) => tag.toLowerCase()));
  return problems.filter((problem) => problem.tags.some((tag) => tagSet.has(tag.toLowerCase())));
}

export default function StudentPlanClient() {
  const [activeTopicKey, setActiveTopicKey] = useState(TOPICS[0].key);

  const topicToProblems = useMemo(() => {
    return TOPICS.reduce<Record<string, Problem[]>>((acc, topic) => {
      acc[topic.key] = getProblemsForTopic(topic, MOCK_PROBLEMS);
      return acc;
    }, {});
  }, []);

  const activeTopic = TOPICS.find((topic) => topic.key === activeTopicKey) ?? TOPICS[0];
  const visibleProblems = topicToProblems[activeTopic.key] ?? [];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Plan</h1>
        <p className="mt-2 text-zinc-400">
          Click a topic to view all related practice problems.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {TOPICS.map((topic) => {
            const isActive = topic.key === activeTopic.key;
            const count = topicToProblems[topic.key]?.length ?? 0;

            return (
              <button
                key={topic.key}
                onClick={() => setActiveTopicKey(topic.key)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <span>{topic.label}</span>
                <span className="ml-2 text-xs text-zinc-400">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-300">
            {activeTopic.label} problems: <span className="font-semibold text-zinc-100">{visibleProblems.length}</span>
          </div>

          {visibleProblems.length === 0 ? (
            <div className="px-4 py-8 text-sm text-zinc-400">
              No problems found for {activeTopic.label} yet. Add problems with this tag in mock data to populate this section.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {visibleProblems
                .slice()
                .sort((a, b) => a.number - b.number)
                .map((problem) => (
                  <div key={problem.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-100 truncate">
                          {problem.number}. {problem.title}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 truncate">
                          Tags: {problem.tags.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <DifficultyBadge difficulty={problem.difficulty} />
                        <span className="text-xs text-zinc-400 tabular-nums">{problem.acceptanceRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
