'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useSubmissionStore } from '@/context/SubmissionContext';
import ProblemStatement from './ProblemStatement';
import CodeEditorPanel, { RunResult } from './CodeEditorPanel';
import TestResultsPanel from './TestResultsPanel';
import { buildMentorAnalysis } from '@/lib/mentorAnalysisV2';

const MIN_LEFT_WIDTH = 340;
const MIN_RIGHT_WIDTH = 360;
const MIN_EDITOR_HEIGHT = 260;
const MIN_TEST_HEIGHT = 180;

type DragAxis = 'horizontal' | 'vertical' | null;

interface ExecutionState {
  runResult: RunResult | null;
  isLoading: boolean;
  loadingType: 'run' | 'submit' | null;
  errorMessage: string | null;
}

export default function ProblemDetailClient() {
  const searchParams = useSearchParams();
  const { submissions: allSubmissions } = useSubmissionStore();
  const layoutRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const dragAxisRef = useRef<DragAxis>(null);

  const [leftRatio, setLeftRatio] = useState(0.48);
  const [topRatio, setTopRatio] = useState(0.64);
  const [activeDragAxis, setActiveDragAxis] = useState<DragAxis>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [executionState, setExecutionState] = useState<ExecutionState>({
    runResult: null,
    isLoading: false,
    loadingType: null,
    errorMessage: null,
  });

  const problemId = searchParams.get('id');
  const problemSlug = searchParams.get('slug');

  const problem =
    MOCK_PROBLEMS.find((item) => item.id === problemId) ||
    MOCK_PROBLEMS.find((item) => item.slug === problemSlug) ||
    MOCK_PROBLEMS[0];

  if (!problem) {
    return (
      <div className="p-6 text-zinc-400">
        No problem found.
      </div>
    );
  }

  const submissions = allSubmissions.filter((submission) => submission.problemId === problem.id);
  const insightsAnalysis = useMemo(() => {
    if (!executionState.runResult || executionState.runResult.type !== 'submit') {
      return null;
    }

    // Use real backend mentor analysis if available
    if (executionState.runResult.mentorAnalysis) {
      return executionState.runResult.mentorAnalysis;
    }

    // Fallback to frontend analysis for offline/testing
    return buildMentorAnalysis({
      problem,
      code: executionState.runResult.code,
      verdict: executionState.runResult.verdict,
      passedCount: executionState.runResult.passedCount,
      totalCount: executionState.runResult.totalCount,
      testResults: executionState.runResult.testResults,
      errorMessage: executionState.runResult.errorMessage,
      stdout: executionState.runResult.stdout,
    });
  }, [executionState.runResult, problem]);

  const clampHorizontalRatio = useCallback((nextRatio: number) => {
    const containerWidth = layoutRef.current?.clientWidth;
    if (!containerWidth) {
      return Math.min(0.72, Math.max(0.28, nextRatio));
    }

    const min = MIN_LEFT_WIDTH / containerWidth;
    const max = 1 - MIN_RIGHT_WIDTH / containerWidth;
    return Math.min(max, Math.max(min, nextRatio));
  }, []);

  const clampVerticalRatio = useCallback((nextRatio: number) => {
    const rightPaneHeight = rightPaneRef.current?.clientHeight;
    if (!rightPaneHeight) {
      return Math.min(0.8, Math.max(0.35, nextRatio));
    }

    const min = MIN_EDITOR_HEIGHT / rightPaneHeight;
    const max = 1 - MIN_TEST_HEIGHT / rightPaneHeight;
    return Math.min(max, Math.max(min, nextRatio));
  }, []);

  useEffect(() => {
    const syncCompactMode = () => setIsCompact(window.innerWidth < 1024);
    syncCompactMode();
    window.addEventListener('resize', syncCompactMode);

    return () => window.removeEventListener('resize', syncCompactMode);
  }, []);

  useEffect(() => {
    if (isCompact) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      if (dragAxisRef.current === 'horizontal') {
        const rect = layoutRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }
        const next = (event.clientX - rect.left) / rect.width;
        setLeftRatio(clampHorizontalRatio(next));
      }

      if (dragAxisRef.current === 'vertical') {
        const rect = rightPaneRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }
        const next = (event.clientY - rect.top) / rect.height;
        setTopRatio(clampVerticalRatio(next));
      }
    };

    const stopDragging = () => {
      dragAxisRef.current = null;
      setActiveDragAxis(null);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [clampHorizontalRatio, clampVerticalRatio, isCompact]);

  useEffect(() => {
    if (isCompact) {
      return;
    }

    const keepPaneSizesInBounds = () => {
      setLeftRatio((current) => clampHorizontalRatio(current));
      setTopRatio((current) => clampVerticalRatio(current));
    };

    keepPaneSizesInBounds();
    window.addEventListener('resize', keepPaneSizesInBounds);
    return () => window.removeEventListener('resize', keepPaneSizesInBounds);
  }, [clampHorizontalRatio, clampVerticalRatio, isCompact]);

  const startHorizontalDrag = () => {
    dragAxisRef.current = 'horizontal';
    setActiveDragAxis('horizontal');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const startVerticalDrag = () => {
    dragAxisRef.current = 'vertical';
    setActiveDragAxis('vertical');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
  };

  const mobileSections = useMemo(
    () => (
      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto bg-zinc-950">
        <section className="h-[52vh] min-h-[340px] border-b border-zinc-800 overflow-hidden">
          <ProblemStatement problem={problem} submissions={submissions} insightsAnalysis={insightsAnalysis} />
        </section>
        <section className="h-[52vh] min-h-[320px] border-b border-zinc-800 overflow-hidden">
          <CodeEditorPanel problem={problem} onExecutionStateChange={setExecutionState} />
        </section>
        <section className="h-[38vh] min-h-[220px] overflow-hidden">
          <TestResultsPanel
            problem={problem}
            runResult={executionState.runResult}
            isLoading={executionState.isLoading}
            loadingType={executionState.loadingType}
            errorMessage={executionState.errorMessage}
          />
        </section>
      </div>
    ),
    [executionState, problem, submissions],
  );

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {mobileSections}

      <div ref={layoutRef} className="hidden lg:flex flex-1 min-h-0">
        <div
          className="min-h-0 min-w-0 border-r border-zinc-800 overflow-hidden flex flex-col transition-all duration-200"
          style={{ width: `${leftRatio * 100}%` }}
        >
          <div className="min-h-0 overflow-auto">
            <ProblemStatement problem={problem} submissions={submissions} insightsAnalysis={insightsAnalysis} />
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize problem and editor panels"
          onMouseDown={startHorizontalDrag}
          className={`w-1.5 flex-shrink-0 cursor-col-resize transition-all duration-200 ${
            activeDragAxis === 'horizontal' ? 'bg-blue-500 shadow-lg' : 'bg-zinc-800 hover:bg-blue-500/70'
          }`}
        />

        <div
          ref={rightPaneRef}
          className="min-h-0 min-w-0 flex flex-col overflow-hidden transition-all duration-200"
          style={{ width: `${(1 - leftRatio) * 100}%` }}
        >
          <div className="min-h-0 overflow-hidden" style={{ height: `${topRatio * 100}%` }}>
            <CodeEditorPanel problem={problem} onExecutionStateChange={setExecutionState} />
          </div>

          <div
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize editor and test panels"
            onMouseDown={startVerticalDrag}
            className={`h-1.5 flex-shrink-0 cursor-row-resize transition-all duration-200 ${
              activeDragAxis === 'vertical' ? 'bg-blue-500 shadow-lg' : 'bg-zinc-800 hover:bg-blue-500/70'
            }`}
          />

          <div className="min-h-0 overflow-hidden border-t border-zinc-800" style={{ height: `${(1 - topRatio) * 100}%` }}>
            <TestResultsPanel
              problem={problem}
              runResult={executionState.runResult}
              isLoading={executionState.isLoading}
              loadingType={executionState.loadingType}
              errorMessage={executionState.errorMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
