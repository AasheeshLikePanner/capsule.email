'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import { langs } from '@uiw/codemirror-extensions-langs';
import { useTheme } from 'next-themes';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: 'javascript' | 'python';
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const { theme } = useTheme();
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  const langExtension = language === 'javascript' ? [langs.javascript({ jsx: true })] : [langs.python()];

  return (
    <div className="relative rounded-lg border bg-card font-mono text-sm overflow-hidden">
      <div className="absolute top-2.5 right-2.5 z-10">
        <button
          onClick={onCopy}
          className="p-1.5 rounded-md bg-gray-800/70 hover:bg-gray-700/70 transition-colors duration-200"
        >
          {hasCopied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
      <CodeMirror
        value={code.trim()}
        theme={theme === 'dark' ? vscodeDark : githubLight}
        extensions={langExtension}
        readOnly
        basicSetup={{
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          lineNumbers: false,
          gutter: false,
        }}
        className="p-4"
      />
    </div>
  );
};
