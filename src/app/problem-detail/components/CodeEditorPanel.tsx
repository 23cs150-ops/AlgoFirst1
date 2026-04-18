'use client';
import React, { useState, useRef } from 'react';
import { Problem } from '@/lib/mockData';
import { LANGUAGES } from '@/lib/mockData';
import { Submission } from '@/lib/mockData';
import { useSubmissionStore } from '@/context/SubmissionContext';
import MonacoEditorWrapper from './MonacoEditor';
import TestResultsPanel from './TestResultsPanel';
import VerdictBadge from '@/components/ui/VerdictBadge';
import { toast } from 'sonner';
import {
  Play,
  Send,
  ChevronDown,
  Loader2,
  RotateCcw,
  Maximize2,
  Settings2,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

type VerdictStatus =
  | 'Accepted' |'Wrong Answer' |'Time Limit Exceeded' |'Runtime Error' |'Compilation Error' |'Pending' |'Running';

interface RunResult {
  type: 'run' | 'submit';
  verdict: VerdictStatus;
  runtime?: string;
  memory?: string;
  passedCount?: number;
  totalCount?: number;
  testResults?: {
    id: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    runtime?: string;
  }[];
  errorMessage?: string;
  stdout?: string;
}

interface CodeEditorPanelProps {
  problem: Problem;
}

export default function CodeEditorPanel({ problem }: CodeEditorPanelProps) {
  const { addSubmission } = useSubmissionStore();
  const [selectedLangId, setSelectedLangId] = useState('python3');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [code, setCode] = useState(problem.starterCode['python3']);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const editorRef = useRef<unknown>(null);

  const selectedLang = LANGUAGES.find((l) => l.id === selectedLangId) || LANGUAGES[1];

  const normalizeCode = (value: string) => value.replace(/\s+/g, '').trim();
  const starterForCurrentLanguage = problem.starterCode[selectedLangId] || '';

  const detectLanguageMismatch = (source: string, langId: string) => {
    const text = source.toLowerCase();

    const looksJava = /\bpublic\s+class\b|\bsystem\.out\.println\b|\bstatic\s+void\s+main\b/.test(text);
    const looksPython = /\bdef\s+[a-z_][a-z0-9_]*\s*\(|\bprint\s*\(|\bself\b/.test(text);
    const looksCpp = /#include\s*<|\bstd::\b|\busing\s+namespace\s+std\b/.test(text);
    const looksJavaScript = /\bconsole\.log\b|\bfunction\s+[a-z_]|=>/.test(text);

    if (langId === 'python3' && (looksJava || looksCpp)) return true;
    if (langId === 'java' && (looksPython || looksCpp)) return true;
    if (langId === 'cpp' && (looksPython || looksJava)) return true;
    if (langId === 'javascript' && (looksJava || looksCpp || looksPython)) return true;
    if (langId === 'typescript' && (looksJava || looksCpp || looksPython)) return true;

    return false;
  };

  const evaluateCodeState = () => {
    const current = code.trim();
    const unchanged = normalizeCode(current) === normalizeCode(starterForCurrentLanguage);
    const hasAlgorithmSignal = /\b(return|for|while|if|def|class|function|=>)\b/.test(current);
    const mismatch = detectLanguageMismatch(current, selectedLangId);

    if (!current || unchanged) return 'empty';
    if (mismatch) return 'mismatch';
    if (!hasAlgorithmSignal) return 'weak';
    return 'valid';
  };

  const handleLanguageChange = (langId: string) => {
    setSelectedLangId(langId);
    setCode(problem.starterCode[langId] || '// Write your solution here');
    setLangDropdownOpen(false);
    setRunResult(null);
  };

  const handleReset = () => {
    setCode(problem.starterCode[selectedLangId] || '');
    toast.info('Editor reset to starter code');
  };

  const simulateRun = async (): Promise<RunResult> => {
    // Backend integration: POST /api/submissions/run
    // { problemId: problem.id, language: selectedLangId, code, testCaseInput: problem.testCases[0].input }
    await new Promise((r) => setTimeout(r, 1800));

    // Simulate a plausible result based on code content
    const codeState = evaluateCodeState();
    if (codeState === 'empty') {
      return {
        type: 'run',
        verdict: 'Compilation Error',
        runtime: 'N/A',
        memory: 'N/A',
        errorMessage: 'No executable solution found. Update starter code before running.',
        passedCount: 0,
        totalCount: problem.testCases.length,
      };
    }

    if (codeState === 'mismatch') {
      return {
        type: 'run',
        verdict: 'Compilation Error',
        runtime: 'N/A',
        memory: 'N/A',
        errorMessage: `Language mismatch: selected ${selectedLang.label}, but code looks like another language.`,
        passedCount: 0,
        totalCount: problem.testCases.length,
      };
    }

    if (codeState === 'weak') {
      return {
        type: 'run',
        verdict: 'Wrong Answer',
        runtime: '12 ms',
        memory: '14.2 MB',
        testResults: [
          {
            id: 'run-tc-1',
            input: problem.testCases[0]?.input || '',
            expected: problem.testCases[0]?.expectedOutput || '',
            actual: '[]',
            passed: false,
            runtime: '12 ms',
          },
        ],
        passedCount: 0,
        totalCount: 1,
      };
    }
    return {
      type: 'run',
      verdict: 'Accepted',
      runtime: '52 ms',
      memory: '16.4 MB',
      testResults: problem.testCases.slice(0, 2).map((tc, i) => ({
        id: `run-tc-${i + 1}`,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput,
        passed: true,
        runtime: `${48 + i * 4} ms`,
      })),
      passedCount: 2,
      totalCount: 2,
    };
  };

  const simulateSubmit = async (): Promise<RunResult> => {
    // Backend integration: POST /api/submissions/submit
    // { problemId: problem.id, language: selectedLangId, code }
    // Then poll GET /api/submissions/:id/status until status !== 'Pending'
    await new Promise((r) => setTimeout(r, 2800));

    const codeState = evaluateCodeState();
    if (codeState === 'empty') {
      return {
        type: 'submit',
        verdict: 'Compilation Error',
        runtime: 'N/A',
        memory: 'N/A',
        errorMessage: 'Submission rejected: code is unchanged or empty.',
        passedCount: 0,
        totalCount: problem.testCases.length,
      };
    }

    if (codeState === 'mismatch') {
      return {
        type: 'submit',
        verdict: 'Compilation Error',
        runtime: 'N/A',
        memory: 'N/A',
        errorMessage: `Submission rejected: selected ${selectedLang.label}, but code looks like another language.`,
        passedCount: 0,
        totalCount: problem.testCases.length,
      };
    }

    if (codeState === 'weak') {
      return {
        type: 'submit',
        verdict: 'Wrong Answer',
        runtime: '12 ms',
        memory: '14.2 MB',
        passedCount: 1,
        totalCount: problem.testCases.length,
        testResults: problem.testCases.map((tc, i) => ({
          id: `sub-tc-${i + 1}`,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: i === 0 ? tc.expectedOutput : '[]',
          passed: i === 0,
          runtime: `${12 + i * 2} ms`,
        })),
      };
    }
    return {
      type: 'submit',
      verdict: 'Accepted',
      runtime: '52 ms',
      memory: '16.4 MB',
      passedCount: problem.testCases.length,
      totalCount: problem.testCases.length,
      testResults: problem.testCases.map((tc, i) => ({
        id: `sub-tc-${i + 1}`,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput,
        passed: true,
        runtime: `${48 + i * 3} ms`,
      })),
    };
  };

  const handleRun = async () => {
    setIsRunning(true);
    setBottomPanelOpen(true);
    setRunResult(null);
    setErrorMessage(null);
    try {
      const result = await simulateRun();
      setRunResult(result);
      if (result.verdict === 'Accepted') {
        toast.success('All sample test cases passed!');
      } else {
        toast.error('Some test cases failed. Check the results below.');
      }
    } catch {
      const msg = 'Failed to run code. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setBottomPanelOpen(true);
    setRunResult(null);
    setErrorMessage(null);
    try {
      const result = await simulateSubmit();
      setRunResult(result);

      const normalizedStatus: Submission['status'] =
        result.verdict === 'Running' || result.verdict === 'Pending'
          ? 'Pending'
          : result.verdict;

      addSubmission({
        problemId: problem.id,
        language: selectedLangId,
        status: normalizedStatus,
        runtime: result.runtime || 'N/A',
        memory: result.memory || 'N/A',
        code,
      });

      if (result.verdict === 'Accepted') {
        toast.success('🎉 Accepted! All test cases passed.', { duration: 5000 });
      } else if (result.verdict === 'Wrong Answer') {
        toast.error('Wrong Answer — check your logic against the failing test case.');
      } else if (result.verdict === 'Time Limit Exceeded') {
        toast.warning('Time Limit Exceeded — optimize your algorithm.');
      } else if (result.verdict === 'Compilation Error') {
        toast.error('Compilation Error — write a solution before submitting.');
      } else {
        toast.error(`${result.verdict} — review the error details below.`);
      }
    } catch {
      const msg = 'Submission failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isRunning || isSubmitting;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/70 flex-shrink-0 gap-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm text-zinc-200 font-medium transition-all duration-150"
          >
            <span className="font-mono text-xs">{selectedLang.label}</span>
            <ChevronDown size={13} className={`text-zinc-500 transition-transform duration-150 ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 fade-in">
              {LANGUAGES.map((lang) => (
                <button
                  key={`lang-opt-${lang.id}`}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors
                    ${selectedLangId === lang.id
                      ? 'bg-blue-500/10 text-blue-400' :'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                    }
                  `}
                >
                  <span className="font-mono">{lang.label}</span>
                  {selectedLangId === lang.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editor Settings */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-all"
              title="Editor settings"
            >
              <Settings2 size={15} />
            </button>
            {settingsOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 p-3 fade-in space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Font size</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                      className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 text-sm font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-sm font-mono text-zinc-200 tabular-nums">
                      {fontSize}px
                    </span>
                    <button
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 text-sm font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-all"
            title="Reset to starter code"
          >
            <RotateCcw size={15} />
          </button>

          <button
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-all"
            title="Fullscreen editor"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden min-h-0">
        <MonacoEditorWrapper
          language={selectedLang.monacoLang}
          value={code}
          onChange={(val) => setCode(val || '')}
          fontSize={fontSize}
        />
      </div>

      {/* Bottom Panel Toggle */}
      <div
        className="flex-shrink-0 border-t border-zinc-800 bg-zinc-900/50 cursor-pointer"
        onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400">
              {runResult ? 'Test Results' : 'Test Cases'}
            </span>
            {runResult && (
              <VerdictBadge status={runResult.verdict} size="sm" />
            )}
            {runResult?.passedCount !== undefined && (
              <span className="text-xs font-mono text-zinc-500 tabular-nums">
                {runResult.passedCount}/{runResult.totalCount} passed
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-zinc-600">
            {bottomPanelOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
      </div>

      {/* Test Results Panel */}
      {bottomPanelOpen && (
        <div className="flex-shrink-0 border-t border-zinc-800 h-52 overflow-hidden">
          <TestResultsPanel
            problem={problem}
            runResult={runResult}
            isLoading={isLoading}
            loadingType={isRunning ? 'run' : isSubmitting ? 'submit' : null}
            errorMessage={errorMessage}
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex-shrink-0 border-t border-zinc-800 bg-zinc-900 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {errorMessage && !isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={13} />
              <span>{errorMessage}</span>
            </div>
          )}
          {!errorMessage && runResult && (
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              {runResult.runtime && (
                <span className="font-mono tabular-nums">{runResult.runtime}</span>
              )}
              {runResult.memory && (
                <span className="font-mono tabular-nums">{runResult.memory}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
              border transition-all duration-150 active:scale-[0.97]
              ${isLoading
                ? 'bg-zinc-800/60 border-zinc-700 text-zinc-500 cursor-not-allowed' :'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600 hover:text-zinc-100'
              }
            `}
          >
            {isRunning ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Run</span>
              </>
            )}
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold
              transition-all duration-150 active:scale-[0.97]
              ${isLoading
                ? 'bg-green-700/40 text-green-400/60 cursor-not-allowed' :'bg-green-600 hover:bg-green-500 text-white'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}