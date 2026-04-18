'use client';
import React, { useState } from 'react';
import ProblemStatement from './ProblemStatement';
import CodeEditorPanel from './CodeEditorPanel';
import { MOCK_PROBLEMS, MOCK_SUBMISSIONS } from '@/lib/mockData';

export default function ProblemDetailClient() {
  // Default to Two Sum for the demo
  const problem = MOCK_PROBLEMS[0];
  const submissions = MOCK_SUBMISSIONS.filter((s) => s.problemId === problem.id);

  const [leftWidth, setLeftWidth] = useState(42);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftWidth(Math.min(Math.max(newWidth, 25), 70));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="flex h-full select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left: Problem Statement */}
      <div
        className="flex flex-col overflow-hidden border-r border-zinc-800"
        style={{ width: `${leftWidth}%` }}
      >
        <ProblemStatement problem={problem} submissions={submissions} />
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          w-1 flex-shrink-0 cursor-col-resize transition-colors duration-150
          ${isDragging ? 'bg-blue-500' : 'bg-zinc-800 hover:bg-blue-500/50'}
        `}
      />

      {/* Right: Editor */}
      <div
        className="flex flex-col overflow-hidden"
        style={{ width: `${100 - leftWidth - 0.3}%` }}
      >
        <CodeEditorPanel problem={problem} />
      </div>
    </div>
  );
}