'use client';
import React from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface MonacoEditorWrapperProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  fontSize?: number;
}

export default function MonacoEditorWrapper({
  language,
  value,
  onChange,
  fontSize = 14,
}: MonacoEditorWrapperProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      loading={
        <div className="w-full h-full flex items-center justify-center bg-zinc-950">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>Loading editor...</span>
          </div>
        </div>
      }
      options={{
        fontSize,
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontLigatures: true,
        lineHeight: 1.6,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        suggest: {
          showKeywords: true,
          showSnippets: true,
        },
        quickSuggestions: true,
        folding: true,
        contextmenu: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
}