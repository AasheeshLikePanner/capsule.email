'use client';

import React, { useState, useEffect } from 'react';
import { EmailRenderer } from '@/components/email-render';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup'; // For HTML/JSX highlighting
import 'prismjs/themes/prism-tomorrow.css'; // Colorful theme
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

interface EmailDisplayPanelProps {
  emailMarkup: string;
  isLoading: boolean;
}

export default function EmailDisplayPanel({ emailMarkup, isLoading }: EmailDisplayPanelProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [code, setCode] = useState(emailMarkup);

  useEffect(() => {
    setCode(emailMarkup);
  }, [emailMarkup]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/30">
        <Image src="/icon.svg" alt="Loading..." width={48} height={48} className="animate-spin-slow" />
      </div>
    );
  }

  if (!emailMarkup) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/30">
        <div className="text-muted-foreground">Email preview will appear here.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-muted/30">
      <div className="flex-1 overflow-auto p-4">
        {view === 'preview' ? (
          <EmailRenderer jsxString={code} />
        ) : (
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.markup, 'markup')}
            padding={10}
            className="line-numbers"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              outline: 0,
              minHeight: '100%',
            }}
            preClassName="line-numbers"
          />
        )}
      </div>
      <div className="flex justify-end p-2 border-t">
        <Button
          variant={view === 'preview' ? 'default' : 'outline'}
          onClick={() => setView('preview')}
          className="mr-2"
        >
          Preview
        </Button>
        <Button
          variant={view === 'code' ? 'default' : 'outline'}
          onClick={() => setView('code')}
        >
          Code
        </Button>
      </div>
    </div>
  );
}
