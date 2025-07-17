'use client';

import { useState, useEffect, memo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import EmailPreview from '@/components/email-preview';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const MemoizedEmailPreview = memo(EmailPreview);

// A dedicated component for rendering the bot's message with a typing animation
const BotMessage = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < content.length) {
        setDisplayedContent(content.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10); // Adjust typing speed for the animation

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="max-w-lg">
      <pre className="whitespace-pre-wrap font-sans text-sm text-foreground break-words"><code>{displayedContent}</code></pre>
    </div>
  );
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialPromptFromUrl = searchParams.get('prompt');
  const hasHandledInitialPrompt = useRef(false);

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'bot', content: string }[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [emailMarkup, setEmailMarkup] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (initialPromptFromUrl && !hasHandledInitialPrompt.current) {
      hasHandledInitialPrompt.current = true;
      handleSendMessage(initialPromptFromUrl, true);
    }
  }, [initialPromptFromUrl]);

  const handleSendMessage = async (messageToSend: string, isInitial = false) => {
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    const newMessages:any = isInitial 
      ? [{ type: 'user', content: messageToSend }]
      : [...messages, { type: 'user', content: messageToSend }];
    
    setMessages(newMessages);
    setPrompt('');
    setStreamingContent('');

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageToSend }),
      });

      setIsLoading(false);

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Add the complete message to the history once the stream is done
            setMessages(prev => [...prev, { type: 'bot', content: fullResponse }]);
            setStreamingContent('');
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setStreamingContent(fullResponse);
          setEmailMarkup(fullResponse);
        }
      } else {
        throw new Error('The response body is empty.');
      }
    } catch (error) {
        setIsLoading(false);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setMessages(prev => [...prev, { type: 'bot', content: `Sorry, something went wrong: ${errorMessage}` }]);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-full bg-background "> 
      <div className="flex flex-col w-1/2 min-h-0 "> 
        {/* This main content area is the only part that scrolls */}
        <div className="flex-1 overflow-y-auto p-6 "> 
            <div className="flex flex-col space-y-5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.type === 'user' ? (
                      <div className="max-w-lg rounded-2xl px-4 py-3 bg-muted text-muted-foreground shadow-sm">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ) : (
                      // Use the dedicated component for historical bot messages
                      <BotMessage content={msg.content} />
                    )}
                </div>
              ))}
              {/* Render the currently streaming message */} 
              {streamingContent && <BotMessage content={streamingContent} />}

              {isLoading && (
                <div className="flex justify-start">
                   <div className="max-w-lg">
                      <div className="flex items-center justify-center p-2">
                          <Image src="/icon.svg" alt="Loading..." width={24} height={24} className="animate-spin-slow" />
                      </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* This footer with the form is fixed at the bottom */}
          <footer className="p-4 border-t flex-shrink-0"> 
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                placeholder="Tell the AI what to change..."
                className="w-full text-base p-4 pr-14 rounded-xl resize-none border-input bg-card  focus-visible:ring-1 focus-visible:ring-offset-0"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="absolute bottom-3.5 right-3.5">
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  disabled={isLoading || !prompt.trim()}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </footer>
      </div>
      <div className="w-1/2 h-full bg-muted/30 overflow-hidden "> 
        <MemoizedEmailPreview initialMarkup={emailMarkup} />
      </div>
    </div>
  );
}