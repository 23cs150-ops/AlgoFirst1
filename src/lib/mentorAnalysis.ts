import { Problem } from '@/lib/mockData';

export interface MentorFailedCase {
  input: string;
  expected: string;
  actual: string;
  reason: string;
}

export interface MentorComplexity {
  currentTime: string;
  currentSpace: string;
  optimalTime: string;
  optimalSpace: string;
  efficiencyScore: number;
}

export interface MentorVisualizationStep {
  step: number;
  action: string;
  state: Record<string, string | number | boolean>;
}

export interface MentorAnalysis {
  verdict: string;
  confidenceScore: number;
  isClose: boolean;
  rootCause: string;
  failedCase: MentorFailedCase;
  complexity: MentorComplexity;
  complexityChart: {
    current: string;
    optimal: string;
  };
  optimizationSuggestions: string[];
  progressiveHints: string[];
  edgeCases: string[];
  patternDetected: string;
  visualizationSteps: MentorVisualizationStep[];
  interviewInsight: string;
}

interface AnalysisTestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface AnalysisRunResult {
  verdict: string;
  passedCount?: number;
  totalCount?: number;
  testResults?: AnalysisTestResult[];
  errorMessage?: string;
}

function detectPattern(problem: Problem): string {
  const tags = problem.tags.map((tag) => tag.toLowerCase());
  const patterns = ['sliding window', 'binary search', 'dynamic programming', 'stack', 'queue', 'tree', 'graph', 'linked list', 'hash table', 'recursion', 'array'];

  for (const pattern of patterns) {
    if (tags.some((tag) => tag.includes(pattern))) {
      return pattern
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
  }

  return problem.tags[0] || 'Unknown';
}

function getOptimalComplexity(pattern: string): { time: string; space: string } {
  switch (pattern.toLowerCase()) {
    case 'sliding window':
      return { time: 'O(n)', space: 'O(1)' };
    case 'binary search':
      return { time: 'O(log n)', space: 'O(1)' };
    case 'dynamic programming':
      return { time: 'O(n)', space: 'O(n)' };
    case 'stack':
    case 'queue':
    case 'hash table':
    case 'linked list':
    case 'array':
      return { time: 'O(n)', space: 'O(n)' };
    case 'tree':
    case 'graph':
    case 'recursion':
      return { time: 'O(n)', space: 'O(n)' };
    default:
      return { time: 'O(n)', space: 'O(1)' };
  }
}

function buildVisualizationSteps(pattern: string, testInput: string, passed: boolean): MentorVisualizationStep[] {
  const trimmedInput = testInput.split('\n')[0] || testInput;

  switch (pattern.toLowerCase()) {
    case 'sliding window':
      return [
        { step: 1, action: 'Initialize left and right pointers at the start.', state: { left: 0, right: 0, window: trimmedInput } },
        { step: 2, action: 'Expand the window while the constraint stays valid.', state: { left: 0, right: 1, valid: true } },
        { step: 3, action: passed ? 'Record the best window length.' : 'Shrink the window at the first invalid overlap.', state: { left: 1, right: 1, status: passed ? 'stable' : 'repair' } },
      ];
    case 'binary search':
      return [
        { step: 1, action: 'Set low/high bounds on the search space.', state: { low: 0, high: 'n - 1', input: trimmedInput } },
        { step: 2, action: 'Check the middle and discard one half.', state: { mid: 'floor((low + high) / 2)', decision: 'shrink' } },
        { step: 3, action: passed ? 'Continue until the target is isolated.' : 'Verify the boundary update does not skip the answer.', state: { low: 'updated', high: 'updated' } },
      ];
    case 'stack':
      return [
        { step: 1, action: 'Push opening symbols or pending state onto the stack.', state: { stack: ['start'], input: trimmedInput } },
        { step: 2, action: 'Pop when a matching closing symbol appears.', state: { stack: ['pending'], match: true } },
        { step: 3, action: passed ? 'Finish with an empty or valid stack state.' : 'Check the first mismatch or empty-pop case.', state: { stack: passed ? [] : ['mismatch'] } },
      ];
    default:
      return [
        { step: 1, action: 'Scan the first testcase and track the core invariant.', state: { input: trimmedInput } },
        { step: 2, action: 'Compare the observed output with the expected output.', state: { status: passed ? 'matched' : 'mismatch' } },
        { step: 3, action: passed ? 'The approach is consistent on this case.' : 'The failure is likely an edge-case or invariant break.', state: { verdict: passed ? 'pass' : 'fail' } },
      ];
  }
}

function buildHints(pattern: string, verdict: string, isClose: boolean, passedCount: number, totalCount: number): string[] {
  const ratioHint = totalCount > 0 ? `${passedCount}/${totalCount} tests pass.` : 'No test breakdown available.';

  if (verdict === 'Accepted') {
    return [
      `Core idea is correct. ${ratioHint}`,
      `Use ${pattern} as the interview pattern to justify the approach.`,
      'Keep the same invariant and focus on clean edge-case handling.',
    ];
  }

  if (verdict === 'Time Limit Exceeded') {
    return [
      `The current approach repeats work; aim for the optimal ${pattern} style solution.`,
      `Reduce the time bound toward ${getOptimalComplexity(pattern).time}.`,
      'Look for an unnecessary nested loop, repeated scan, or redundant recomputation.',
    ];
  }

  if (verdict === 'Wrong Answer') {
    return [
      isClose ? 'Your idea is close, but one invariant breaks on a boundary case.' : 'The main logic diverges from the expected invariant.',
      `Recheck duplicate handling, index movement, and state updates for ${pattern}.`,
      'Trace the first failing testcase and compare each step against the expected state.',
    ];
  }

  return [
    'Check the exact compiler/runtime message first.',
    'If the issue is syntax, fix the function signature and braces before retesting.',
    'If the issue is runtime, inspect null/empty input handling and out-of-bounds access.',
  ];
}

function buildEdgeCases(problem: Problem): string[] {
  const edges = new Set<string>();
  edges.add('Smallest valid input size');
  edges.add('Repeated values or duplicates');

  if (problem.tags.some((tag) => /string|array/i.test(tag))) {
    edges.add('Single-element or empty-like boundary representation');
  }

  if (problem.constraints.some((constraint) => /10⁴|10\^4|10⁵|10\^5/.test(constraint))) {
    edges.add('Largest input size near the constraint limit');
  }

  return [...edges];
}

export function buildMentorAnalysis(problem: Problem, runResult: AnalysisRunResult | null): MentorAnalysis | null {
  if (!runResult) {
    return null;
  }

  const patternDetected = detectPattern(problem);
  const testResults = runResult.testResults || [];
  const firstFailed = testResults.find((result) => !result.passed);
  const passedCount = runResult.passedCount ?? testResults.filter((result) => result.passed).length;
  const totalCount = runResult.totalCount ?? testResults.length;
  const isAccepted = runResult.verdict === 'Accepted';
  const isClose = !isAccepted && passedCount > 0 && totalCount > 0 && totalCount - passedCount <= 1;

  const optimal = getOptimalComplexity(patternDetected);
  const currentTime = runResult.verdict === 'Time Limit Exceeded'
    ? 'Likely O(n^2) or worse'
    : isAccepted
    ? optimal.time
    : 'Depends on implementation';
  const currentSpace = runResult.verdict === 'Time Limit Exceeded'
    ? 'Likely O(n)'
    : isAccepted
    ? optimal.space
    : 'Depends on implementation';

  const failedCase: MentorFailedCase = firstFailed
    ? {
        input: firstFailed.input,
        expected: firstFailed.expected,
        actual: firstFailed.actual,
        reason: 'Mismatch on the first failing testcase.',
      }
    : {
        input: testResults[0]?.input || '',
        expected: testResults[0]?.expected || '',
        actual: testResults[0]?.actual || '',
        reason: isAccepted ? 'All sample tests passed.' : runResult.errorMessage || 'No failing testcase data available.',
      };

  const complexity: MentorComplexity = {
    currentTime,
    currentSpace,
    optimalTime: optimal.time,
    optimalSpace: optimal.space,
    efficiencyScore: isAccepted ? 95 : runResult.verdict === 'Time Limit Exceeded' ? 35 : isClose ? 70 : 50,
  };

  return {
    verdict: runResult.verdict,
    confidenceScore: isAccepted ? 96 : runResult.verdict === 'Wrong Answer' ? (isClose ? 82 : 68) : runResult.verdict === 'Time Limit Exceeded' ? 74 : 61,
    isClose,
    rootCause: isAccepted
      ? 'The implementation matches the expected behavior on the checked cases.'
      : runResult.verdict === 'Time Limit Exceeded'
      ? 'The solution is algorithmically too expensive for the constraint range.'
      : runResult.verdict === 'Wrong Answer'
      ? isClose
        ? 'The core idea is correct, but one boundary or state update is off.'
        : 'The logic is not preserving the required invariant.'
      : runResult.verdict === 'Runtime Error'
      ? 'A null, bounds, or type-handling issue is causing the crash.'
      : runResult.verdict === 'Compilation Error'
      ? 'The code does not compile yet, so the next step is to fix syntax or signature mismatches.'
      : 'The result is not stable enough to judge precisely yet.',
    failedCase,
    complexity,
    complexityChart: {
      current: `${complexity.currentTime} / ${complexity.currentSpace}`,
      optimal: `${complexity.optimalTime} / ${complexity.optimalSpace}`,
    },
    optimizationSuggestions: runResult.verdict === 'Accepted'
      ? [
          'Keep the same asymptotic complexity and tighten edge-case checks.',
          `Explain why ${patternDetected} fits the constraints during interviews.`,
        ]
      : runResult.verdict === 'Time Limit Exceeded'
      ? [
          `Move toward ${optimal.time} time by removing nested scans.`,
          'Use memoization, hashing, or two pointers where possible.',
        ]
      : runResult.verdict === 'Wrong Answer'
      ? [
          'Compare state transitions on the first failing testcase.',
          'Check off-by-one, duplicate handling, and early-return conditions.',
        ]
      : [
          'Make the code compile first, then rerun the same testcase.',
          'Guard against null, empty, and out-of-range access.',
        ],
    progressiveHints: buildHints(patternDetected, runResult.verdict, isClose, passedCount, totalCount),
    edgeCases: buildEdgeCases(problem),
    patternDetected,
    visualizationSteps: buildVisualizationSteps(patternDetected, testResults[0]?.input || problem.testCases[0]?.input || '', isAccepted),
    interviewInsight: isAccepted
      ? `Good interview-ready ${patternDetected} answer. Emphasize invariant, complexity, and boundary cases.`
      : `This is a ${patternDetected} problem; interviewers will expect the invariant and the reason the current failure case breaks it.`,
  };
}