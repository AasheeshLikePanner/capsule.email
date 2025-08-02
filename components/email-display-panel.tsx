'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import { Smartphone, Laptop, Save, Send, Check, X, Copy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SendEmailCard from '@/components/send-email-dialog';
import { useCallback, useEffect, useRef, useState } from 'react';

const EmailRenderer = dynamic(() => import('@/components/email-render'), { ssr: false });

interface EmailDisplayPanelProps {
  emailMarkup: string;
  isLoading: boolean;
  emailTitle: string;
  onSave: (htmlContent: string, title: string) => Promise<boolean>;
  emailId: string | null;
  
  onTogglePublic: () => void; // New prop for toggling public status
  onSend: (recipient: string, subject: string) => void;
  isSaving: boolean;
  isOwner: boolean;
  isPublic: boolean;
}

export default function EmailDisplayPanel({ emailMarkup, isLoading, emailTitle, onSave, emailId, onTogglePublic, onSend, isSaving, isOwner, isPublic: initialIsPublic }: EmailDisplayPanelProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [mobileView, setMobileView] = useState(false);
  const [code, setCode] = useState(emailMarkup);
  const [copied, setCopied] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  
  
  const [localSaveStatus, setLocalSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSendEmailCard, setShowSendEmailCard] = useState(false);
  
  const [saveProgress, setSaveProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredSave = useRef(false); // New ref to track if save has been triggered
  const SAVE_DURATION = 1500; // milliseconds to hold the button for save

  useEffect(() => {
    if (localSaveStatus === 'success' || localSaveStatus === 'error') {
      const timer = setTimeout(() => {
        setLocalSaveStatus('idle');
      }, 2000); // Revert to idle after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [localSaveStatus]);

  const handleMouseDownSave = useCallback(() => {
    if (isSaving) return; // Don't start if already saving via prop
    setSaveProgress(0);
    hasTriggeredSave.current = false; // Reset for new press
    setLocalSaveStatus('idle'); // Reset local status on new press

    progressIntervalRef.current = setInterval(async () => { // Made async
      setSaveProgress((prevProgress) => {
        const newProgress = prevProgress + (1000 / SAVE_DURATION);
        if (newProgress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          if (!hasTriggeredSave.current) {
            hasTriggeredSave.current = true;
            // Await the onSave call and get the result
            onSave(code, emailTitle).then(success => {
              setLocalSaveStatus(success ? 'success' : 'error');
            });
          }
          return 100;
        }
        return newProgress;
      });
    }, 10);
  }, [isSaving, code, emailTitle, onSave]);

  const handleMouseUpSave = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setSaveProgress(0);
    hasTriggeredSave.current = false;
  }, []);

  const getSaveButtonClasses = useCallback(() => {
    let classes = "mr-1 relative overflow-hidden";
    if (localSaveStatus === 'success') {
      classes += " bg-green-500 hover:bg-green-600 text-white";
    } else if (localSaveStatus === 'error') {
      classes += " bg-red-500 hover:bg-red-600 text-white";
    }
    return classes;
  }, [localSaveStatus]);

  const getSaveButtonText = useCallback(() => {
    if (isSaving) {
      return 'Saving...';
    } else if (localSaveStatus === 'success') {
      return 'Saved!';
    } else if (localSaveStatus === 'error') {
      return 'Not Saved!';
    } else {
      return emailId ? 'Update' : 'Save';
    }
  }, [isSaving, localSaveStatus, emailId]);

  

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  }, []);

  const handleSend = (recipient: string, subject: string) => {
    onSend(recipient, subject);
    setShowSendEmailCard(false);
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  useEffect(() => {
    const formatCode = async () => {
      const safeEmailMarkup = typeof emailMarkup === 'string' ? emailMarkup : '';
      if (safeEmailMarkup) {
        try {
          const formattedCode = await prettier.format(safeEmailMarkup, {
            parser: 'html',
            plugins: [parserHtml],
            htmlWhitespaceSensitivity: 'ignore',
          });
          setCode(formattedCode);
        } catch (error) {
          console.error("Error formatting code:", error);
          setCode(safeEmailMarkup); // Fallback to unformatted if error
        }
      } else {
        setCode('');
      }
    };
    formatCode();
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
      <div className="flex items-center justify-center w-full h-full bg-muted/30 rounded-2xl">
        <div className="text-muted-foreground">Email preview will appear here.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-end items-center p-2 border-b h-12">
        <Button
          variant="outline"
          onClick={onTogglePublic}
          disabled={!isOwner}
          className="mr-1 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <Switch
              id="public-mode"
              checked={initialIsPublic}
              onCheckedChange={onTogglePublic}
              disabled={!isOwner}
            />
            <Label htmlFor="public-mode" className="text-sm font-medium cursor-pointer">{initialIsPublic ? 'Public' : 'Private'}</Label>
          </div>
        </Button>
        <Button
          variant="outline"
          className={getSaveButtonClasses()}
          onMouseDown={handleMouseDownSave}
          onMouseUp={handleMouseUpSave}
          onMouseLeave={handleMouseUpSave} // Also reset if mouse leaves button while holding
          disabled={isSaving}
        >
          <div
            className="absolute inset-0 bg-primary/20 transition-all duration-100 ease-linear"
            style={{ width: `${saveProgress}%` }}
          />
          <span className="relative z-10 flex items-center">
            {isSaving ? (
              <Image src="/icon.svg" alt="Saving..." width={20} height={20} className="animate-spin-slow mr-1" />
            ) : localSaveStatus === 'success' ? (
              <Check className="w-4 h-4 mr-1" />
            ) : localSaveStatus === 'error' ? (
              <X className="w-4 h-4 mr-1" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {getSaveButtonText()}
          </span>
        </Button>
        {initialIsPublic && (
          <div className="flex items-center space-x-1 mr-1">
            <Input
              type="text"
              value={window.location.href}
              readOnly
              
              className="w-64 h-9 outline-none border-none select-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="outline" onClick={handleShare}>
              <Copy className="w-4 h-4 mr-1" />
              {copiedShareLink ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}
        <div className="relative w-max">
          <Button variant="outline" onClick={() => setShowSendEmailCard(!showSendEmailCard)}>
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
          {showSendEmailCard && (
            <div className="absolute bg-muted/20 top-full right-0 mt-2 z-10">
              <SendEmailCard
                isOpen={showSendEmailCard}
                onClose={() => setShowSendEmailCard(false)}
                onSend={handleSend}
                defaultSubject={emailTitle}
              />
            </div>
          )}
        </div>
      </div>
      <div className={`flex-1 p-4 ${mobileView ? 'flex items-center justify-center' : ''} min-h-0 overflow-auto`}>
        {view === 'preview' ? (
          <div className={mobileView ? 'w-full max-w-md h-full mx-auto border-4 border-gray-700 rounded-3xl overflow-hidden aspect-[9/16]' : 'w-full h-full overflow-auto'}>
            <EmailRenderer jsxString={code} className="rounded-xl overflow-hidden" />
          </div>
        ) : (
          <CodeMirror
            value={code}
            extensions={[html(), EditorView.theme({
              "&.cm-editor": {
                fontSize: "13px",
                height: "100%",
                overflowY: "auto",
              },
            })]}            
            theme={vscodeDark}
            onChange={(value) => setCode(value)}
          />
        )}
      </div>
      <div className="flex justify-end p-2 border-t h-14">
        {view === 'preview' && (
          <Button
            variant="outline"
            onClick={() => setMobileView(!mobileView)}
            className="mr-2"
          >
            {mobileView ? <Laptop className="w-4 h-4 mr-2" /> : <Smartphone className="w-4 h-4 mr-2" />}
            {mobileView ? 'Desktop' : 'Mobile'}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleCopy}
          className="mr-2"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
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
