import { Problem } from '@/lib/mockData';

export interface MentorScores {
  time: number;
  space: number;
  readability: number;
  optimization: number;
  interview: number;
}

export interface MentorComplexity {
  time: string;
  space: string;
  optimalTime: string;
  optimalSpace: string;
  efficiencyScore: number;
  currentTime?: string;
  currentSpace?: string;
}

export interface MentorVisualizationStep {
  step: number;
  action?: string;
  state?: Record<string, string | number | boolean>;
  // Backend fields
  description?: string;
  pseudoCode?: string;
}

export interface MentorAnalysis {
  verdict: string;
  isClose: boolean;
  rootCause: string;
  complexity: MentorComplexity;
  scores: MentorScores;
  pattern: string;
  improvements: string[];
  hints: string[];
  edgeCases: string[];
  visualization: MentorVisualizationStep[];
  interviewInsight: string;
  confidenceScore?: number;
  patternDetected?: string;
  optimizationSuggestions?: string[];
  progressiveHints?: string[];
  visualizationSteps?: MentorVisualizationStep[];
  complexityChart?: {
    current: string;
    optimal: string;
  };
}

interface MentorTestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface BuildMentorAnalysisInput {
  problem: Problem;
  code?: string;
  verdict: string;
  runtime?: string;
  memory?: string;
  passedCount?: number;
  totalCount?: number;
  testResults?: MentorTestResult[];
  errorMessage?: string;
  stdout?: string;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalize = (value: string) => value.toLowerCase();

function countMatches(code: string, regex: RegExp): number {
  return (code.match(regex) || []).length;
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function limitWords(value: string, maxWords: number): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length <= maxWords ? value.trim() : `${parts.slice(0, maxWords).join(' ')}...`;
}

function detectPattern(problem: Problem, code: string): string {
  const text = normalize(code);
  const tags = problem.tags.map((tag) => tag.toLowerCase());

  if (/\b(low|high|mid|binary search)\b/.test(text) || tags.some((tag) => tag.includes('binary search'))) {
    return 'Binary Search';
  }
  if (/\b(left|right|window|sliding)\b/.test(text) || tags.some((tag) => tag.includes('sliding window'))) {
    return 'Sliding Window';
  }
  if (/\b(dp|memo|cache|dynamic programming)\b/.test(text) || tags.some((tag) => tag.includes('dynamic programming'))) {
    return 'DP';
  }
  if (/\b(queue|bfs)\b/.test(text) || tags.some((tag) => tag.includes('graph'))) {
    return 'BFS';
  }
  if (/\b(dfs|recursive|recursion)\b/.test(text) || tags.some((tag) => tag.includes('tree'))) {
    return 'DFS';
  }
  if (/\b(stack|push\(|pop\()\b/.test(text) || tags.some((tag) => tag.includes('stack'))) {
    return 'Monotonic Stack';
  }
  if (/unordered_map|hashmap|\bmap<|\bdict\b|new map|new set|set<|Map\(/.test(text) || tags.some((tag) => tag.includes('hash'))) {
    return 'HashMap';
  }
  if (countMatches(text, /\bfor\b|\bwhile\b/g) >= 2) {
    return 'Two Pointers';
  }

  return tags[0]
    ? tags[0]
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Array';
}

function inferComplexity(pattern: string, code: string): { time: string; space: string } {
  const text = normalize(code);
  const loopCount = countMatches(text, /\bfor\b|\bwhile\b/g);
  const nested = loopCount >= 2;
  const hasSort = /\.sort\(|sort\(|sorted\(|Arrays\.sort/.test(text);
  const hasHash = /unordered_map|hashmap|\bmap<|\bdict\b|new map|new set|set<|Map\(|Set\(/.test(text);
  const hasRecursion = /return\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(|\bdfs\(|\bbacktrack\(|\bsolve\(/.test(text);
  const hasMemo = /memo|cache|dp|visited/.test(text);

  if (pattern === 'Binary Search') {
    return { time: 'O(log n)', space: 'O(1)' };
  }

  if (pattern === 'Sliding Window' || pattern === 'HashMap' || pattern === 'Monotonic Stack') {
    return { time: 'O(n)', space: hasHash ? 'O(n)' : 'O(1)' };
  }

  if (pattern === 'DP') {
    return { time: nested ? 'O(n^2)' : 'O(n)', space: hasMemo ? 'O(n)' : 'O(1)' };
  }

  if (pattern === 'BFS' || pattern === 'DFS') {
    return { time: 'O(n + m)', space: 'O(n)' };
  }

  if (hasSort) {
    return { time: 'O(n log n)', space: 'O(1)' };
  }

  if (nested) {
    return { time: 'O(n^2)', space: hasHash ? 'O(n)' : 'O(1)' };
  }

  if (hasRecursion && !hasMemo) {
    return { time: 'O(2^n)', space: 'O(n)' };
  }

  if (hasHash) {
    return { time: 'O(n)', space: 'O(n)' };
  }

  return { time: 'O(n)', space: 'O(1)' };
}

function inferOptimalComplexity(problem: Problem, pattern: string): { time: string; space: string } {
  const tags = problem.tags.map((tag) => tag.toLowerCase());

  if (pattern === 'Binary Search') return { time: 'O(log n)', space: 'O(1)' };
  if (pattern === 'Sliding Window' || pattern === 'HashMap' || pattern === 'Monotonic Stack') return { time: 'O(n)', space: 'O(n)' };
  if (pattern === 'DP') return { time: 'O(n)', space: 'O(n)' };
  if (pattern === 'BFS' || pattern === 'DFS') return { time: 'O(n + m)', space: 'O(n)' };
  if (tags.some((tag) => tag.includes('binary search'))) return { time: 'O(log n)', space: 'O(1)' };
  if (tags.some((tag) => tag.includes('sliding window'))) return { time: 'O(n)', space: 'O(1)' };
  if (tags.some((tag) => tag.includes('dynamic programming'))) return { time: 'O(n)', space: 'O(n)' };
  if (tags.some((tag) => tag.includes('graph') || tag.includes('tree'))) return { time: 'O(n + m)', space: 'O(n)' };
  return { time: 'O(n)', space: 'O(1)' };
}

function complexityRank(value: string): number {
  if (value === 'O(1)') return 5;
  if (value === 'O(log n)') return 4;
  if (value === 'O(n)') return 3;
  if (value === 'O(n + m)') return 3;
  if (value === 'O(n log n)') return 2;
  if (value === 'O(n^2)') return 1;
  if (value === 'O(2^n)') return 0;
  return 2;
}

function scoreComplexity(current: string, optimal: string): number {
  const delta = complexityRank(optimal) - complexityRank(current);
  if (delta <= 0) return 96;
  if (delta === 1) return 82;
  if (delta === 2) return 68;
  return 48;
}

function buildRootCause(verdict: string, code: string, testResults: MentorTestResult[] | undefined, errorMessage?: string): string {
  const text = normalize(code);
  const firstFailed = testResults?.find((result) => !result.passed);

  if (verdict === 'Accepted') return 'No functional bug appears in the checked submission path.';
  if (verdict === 'Compilation Error') return limitWords(errorMessage || 'Compilation failed due to syntax or signature mismatch.', 25);
  if (verdict === 'Runtime Error') return limitWords('Likely out-of-bounds or null access on an edge case.', 25);
  if (verdict === 'Time Limit Exceeded') return limitWords('Repeated scans and nested loops make this implementation too slow.', 25);
  if (firstFailed) return limitWords(`Fails on ${firstFailed.input}. Likely boundary or duplicate handling issue.`, 25);
  if (/return\s+\[\]|return\s+0|pass\b/.test(text)) return limitWords('Function returns a default value instead of the computed answer.', 25);
  return limitWords('The control flow misses a boundary condition or state transition.', 25);
}

function buildImprovements(pattern: string, verdict: string, current: { time: string; space: string }, optimal: { time: string; space: string }): string[] {
  const items: string[] = [];

  if (verdict === 'Time Limit Exceeded') {
    items.push('Remove repeated scans or nested loops.');
  }

  if (current.time !== optimal.time) {
    items.push(`Target ${optimal.time} time using ${pattern.toLowerCase()} logic.`);
  }

  if (current.space !== optimal.space) {
    items.push(`Trim space toward ${optimal.space} with a lighter state.`);
  }

  if (items.length === 0) {
    items.push('Keep the same approach and tighten edge handling.');
  }

  return items.slice(0, 3);
}

function buildHints(pattern: string, verdict: string, code: string): string[] {
  const text = normalize(code);
  const hints: string[] = [];

  if (/\b(low|high|mid)\b/.test(text) || pattern === 'Binary Search') {
    hints.push('Check midpoint updates carefully.');
  }
  if (/left|right|window/.test(text) || pattern === 'Sliding Window') {
    hints.push('Move pointers only after resolving conflicts.');
  }
  if (/unordered_map|map<|dict|set<|Map\(/.test(text) || pattern === 'HashMap') {
    hints.push('Insert after checking the complement.');
  }
  if (/dp|memo|cache/.test(text) || pattern === 'DP') {
    hints.push('Confirm the base state before transitions.');
  }
  if (/stack|push\(|pop\(/.test(text) || pattern === 'Monotonic Stack') {
    hints.push('Pop only when the invariant is broken.');
  }

  if (hints.length === 0) {
    hints.push('Trace the first failing testcase manually.');
    hints.push('Compare each state update against expectation.');
  }

  if (verdict !== 'Accepted') {
    hints.push('Focus on the boundary that changes output.');
  }

  return hints.slice(0, 3).map((hint) => hint.split(' ').slice(0, 12).join(' '));
}

function buildEdgeCases(problem: Problem, pattern: string): string[] {
  const edges = new Set<string>();
  edges.add('Smallest valid input');
  edges.add('Duplicate or repeated values');

  if (pattern === 'Binary Search') edges.add('Adjacent boundary values');
  if (pattern === 'Sliding Window') edges.add('All unique or all repeated sequence');
  if (pattern === 'DP') edges.add('Base row or empty state');
  if (pattern === 'BFS' || pattern === 'DFS') edges.add('Disconnected component or single node');
  if (problem.constraints.some((constraint) => /10⁴|10\^4|10⁵|10\^5/.test(constraint))) edges.add('Largest constraint input');

  return [...edges].slice(0, 3);
}

function buildVisualization(pattern: string, code: string, testResults: MentorTestResult[] | undefined): MentorVisualizationStep[] {
  const firstInput = testResults?.[0]?.input || '';

  if (pattern === 'Sliding Window') {
    return [
      { step: 1, action: 'Initialize left/right pointers and seen state.', state: { left: 0, right: 0, window: firstInput } },
      { step: 2, action: 'Shift left when a conflict appears.', state: { left: 1, right: 2, conflict: true } },
    ];
  }

  if (pattern === 'HashMap') {
    return [
      { step: 1, action: 'Scan value and check complement first.', state: { index: 0, map: '{}' } },
      { step: 2, action: 'Store current value after lookup.', state: { index: 1, action: 'insert' } },
    ];
  }

  if (pattern === 'Binary Search') {
    return [
      { step: 1, action: 'Set low, high, and midpoint.', state: { low: 0, high: 'n-1', mid: 'floor' } },
      { step: 2, action: 'Discard one half of the range.', state: { low: 1, high: 3, narrowed: true } },
    ];
  }

  if (pattern === 'DP') {
    return [
      { step: 1, action: 'Initialize base state in the table.', state: { dp0: 0, base: true } },
      { step: 2, action: 'Apply transition for the next state.', state: { prev: 0, next: 1 } },
    ];
  }

  if (pattern === 'BFS' || pattern === 'DFS') {
    return [
      { step: 1, action: 'Start traversal from the source node.', state: { start: firstInput || 'source', visited: 1 } },
      { step: 2, action: 'Expand neighbors and continue traversal.', state: { frontier: 'expanded', visited: 2 } },
    ];
  }

  return [
    { step: 1, action: 'Read the first testcase and apply the invariant.', state: { input: firstInput || 'sample' } },
    { step: 2, action: 'Validate the branch that changes the answer.', state: { branch: 'critical' } },
  ];
}

function buildScores(verdict: string, current: { time: string; space: string }, optimal: { time: string; space: string }, code: string, pattern: string): MentorScores {
  const time = scoreComplexity(current.time, optimal.time);
  const space = scoreComplexity(current.space, optimal.space);
  const readabilityBase = clamp(92 - Math.max(0, countMatches(code, /\bfor\b|\bwhile\b/g) * 5) - Math.max(0, countMatches(code, /\bif\b/g) * 2), 40, 96);
  const optimization = clamp(Math.round((time + space) / 2) - (verdict === 'Time Limit Exceeded' ? 12 : 0), 0, 100);
  const interview = clamp((pattern === 'Binary Search' || pattern === 'Sliding Window' ? 92 : 84) - (verdict === 'Wrong Answer' ? 10 : 0), 0, 100);

  return {
    time,
    space,
    readability: readabilityBase,
    optimization,
    interview,
  };
}

export function buildMentorAnalysis({
  problem,
  code = '',
  verdict,
  passedCount = 0,
  totalCount = 0,
  testResults,
  errorMessage,
}: BuildMentorAnalysisInput): MentorAnalysis {
  const pattern = detectPattern(problem, code);
  const current = inferComplexity(pattern, code);
  const optimal = inferOptimalComplexity(problem, pattern);
  const passRate = totalCount > 0 ? passedCount / totalCount : 0;
  const isClose = verdict === 'Wrong Answer' && (passRate >= 0.75 || (totalCount > 0 && totalCount - passedCount <= 1));
  const rootCause = buildRootCause(verdict, code, testResults, errorMessage);
  const scores = buildScores(verdict, current, optimal, code, pattern);
  const visualization = buildVisualization(pattern, code, testResults);

  const improvements = buildImprovements(pattern, verdict, current, optimal);
  const hints = buildHints(pattern, verdict, code);
  const edgeCases = buildEdgeCases(problem, pattern);
  const efficiencyScore = clamp(Math.round((scores.time + scores.space + scores.optimization) / 3), 0, 100);
  const interviewInsight = limitWords(
    verdict === 'Accepted'
      ? `Explain why ${pattern} matches the constraint profile and keep the invariant explicit.`
      : `State the invariant, then point to the boundary where this ${pattern} attempt breaks.`,
    22,
  );

  return {
    verdict,
    isClose,
    rootCause,
    complexity: {
      time: current.time,
      space: current.space,
      optimalTime: optimal.time,
      optimalSpace: optimal.space,
      efficiencyScore,
      currentTime: current.time,
      currentSpace: current.space,
    },
    scores,
    pattern,
    improvements,
    hints,
    edgeCases,
    visualization,
    interviewInsight,
    confidenceScore: clamp(Math.round((scores.optimization + scores.interview) / 2), 0, 100),
    patternDetected: pattern,
    optimizationSuggestions: improvements,
    progressiveHints: hints,
    visualizationSteps: visualization,
    complexityChart: {
      current: `${current.time} / ${current.space}`,
      optimal: `${optimal.time} / ${optimal.space}`,
    },
  };
}