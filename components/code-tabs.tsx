'use client';

import { useState } from 'react';
import { CodeBlock } from './code-block';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  language: 'javascript' | 'python';
  code: string;
}

interface CodeTabsProps {
  tabs: Tab[];
}

export const CodeTabs = ({ tabs }: CodeTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="my-6 not-prose">
      <div className="flex items-center border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTabData && (
          <CodeBlock
            key={activeTabData.id}
            code={activeTabData.code}
            language={activeTabData.language}
          />
        )}
      </div>
    </div>
  );
};
