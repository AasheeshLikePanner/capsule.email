'use client';

import { useState, useEffect, memo, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation'; // Changed from useSearchParams
import Image from 'next/image';
import axios from 'axios';
import { useBrandKitStore } from '@/lib/store/brandKitStore';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailDisplayPanel from '@/components/email-display-panel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';


interface BotMessageContent {
  title?: string;
  text?: string;
  description?: string;
  code?: string; // Add code property
}

interface UserMessageContent {
  emailContent: string;
  brandKit?: any;
}

interface ChatMessage {
  id: string;
  chat_session_id: string;
  user_id: string;
  type: 'user' | 'bot';
  content: UserMessageContent | BotMessageContent | string; // Can be string for old messages or parsed content
  created_at: string;
}

export default function ChatPage() {
  const params = useParams(); // Changed from useSearchParams
  const chatId = params.chatId as string; // Get chatId from params

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Updated type
  const [emailMarkup, setEmailMarkup] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [emailId, setEmailId] = useState<string | null>(null);
  const emailMarkupRef = useRef('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showKitNameDialog, setShowKitNameDialog] = useState(false);
  const [tempKitName, setTempKitName] = useState('');
  const emailToSaveRef = useRef<{ htmlContent: string; title: string } | null>(null);
  const currentRecipientIndex = useRef(0); // Manages the index for dynamic recipient names

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Define recipient names for dynamic replacement
  const recipientNames = ["Aasheesh", "Aniket", "Priya", "Rahul", "Sneha"];
  const { brandKits } = useBrandKitStore();
  const [selectedBrandKit, setSelectedBrandKit] = useState<any>(null);
  const selectedBrandKitRef = useRef<any>(null);
  const hasSetInitialBrandKit = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    emailMarkupRef.current = emailMarkup;
  }, [emailMarkup]);

  // New useEffect to fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/chats/${chatId}/messages`);
        setMessages(response.data);

        // Set initial email markup if the last message is a bot message with code
        const lastBotMessage = response.data.findLast((msg: ChatMessage) => msg.type === 'bot' && (msg.content as BotMessageContent).code);
        if (lastBotMessage) {
          setEmailMarkup((lastBotMessage.content as BotMessageContent).code || '');
          setEmailTitle((lastBotMessage.content as BotMessageContent).title || '');
        }

        // Try to set selectedBrandKit from the first user message if available
        const firstUserMessage = response.data.find((msg: ChatMessage) => msg.type === 'user' && (msg.content as UserMessageContent).brandKit);
        if (firstUserMessage && !hasSetInitialBrandKit.current) {
          setSelectedBrandKit((firstUserMessage.content as UserMessageContent).brandKit);
          hasSetInitialBrandKit.current = true;
        }

      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleSendMessage = useCallback(async (messageToSend: string) => {
    if (!messageToSend.trim()) return;

    setIsLoading(true);

    // Optimistically add user message to UI
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(), // Temporary ID
      chat_session_id: chatId,
      user_id: 'current_user_id', // Replace with actual user ID
      type: 'user',
      content: { emailContent: messageToSend, brandKit: selectedBrandKit },
      created_at: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    setPrompt('');

    try {
      const response:any = await axios.post('/api/generate-email', {
        prompt: messageToSend,
        brandKit: selectedBrandKit,
        context: emailMarkupRef.current,
        chatId: chatId, // Pass chatId for subsequent messages
      });

      setIsLoading(false);

      const data = response.data;

      let botMessageContent: BotMessageContent | string;
      
      if (data.code) {
        const name = recipientNames[currentRecipientIndex.current];
        currentRecipientIndex.current = (currentRecipientIndex.current + 1) % recipientNames.length;
        const replacedCode = data.code.replace(/\[Recipient Name\]/g, name);

        setEmailMarkup(replacedCode);
        setEmailTitle(data.title || '');
        botMessageContent = { title: data.title, text: data.text, description: data.description, code: replacedCode };
      } else {
        setEmailMarkup('');
        botMessageContent = data.text || 'Sorry, I could not generate a response.';
      }

      const newBotMessage: ChatMessage = {
        id: Date.now().toString(), // Temporary ID
        chat_session_id: chatId,
        user_id: 'bot_id', // Or current_user_id if bot messages are attributed to the user's session
        type: 'bot',
        content: botMessageContent,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newBotMessage]);

    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        chat_session_id: chatId, 
        user_id: 'error_id', 
        type: 'bot', 
        content: `Sorry, something went wrong: ${errorMessage}`, 
        created_at: new Date().toISOString() 
      }]);
    }
  }, [chatId, selectedBrandKit]); // Added chatId to dependencies

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    handleSendMessage(prompt);
  };

  const handleSaveEmail = async (htmlContent: string, title: string): Promise<boolean> => {
    if (!selectedBrandKit?.kit_name) {
      emailToSaveRef.current = { htmlContent, title };
      setShowKitNameDialog(true);
      return false; // Indicate that save is pending user input
    }

    setIsSaving(true);
    try {
      const response = await axios.post('/api/emails', {
        html_content: htmlContent,
        name: title,
        kit_name: selectedBrandKit.kit_name,
      });
      console.log("Email saved successfully:", response.data);
      if (response.data.data && response.data.data.length > 0) {
        setEmailId(response.data.data[0].id);
      }
      return true; // Indicate success
    } catch (error) {
      console.error("Error saving email:", error);
      return false; // Indicate failure
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareEmail = (id: string) => {
    if (id) {
      const shareableLink = `${window.location.origin}/emails/${id}`;
      navigator.clipboard.writeText(shareableLink);
      console.log("Shareable link copied:", shareableLink);
    }
  };

  const handleSendEmail = async (recipient: string, subject: string) => {
    try {
      const response = await axios.post('/api/send-email', {
        to: recipient,
        subject: subject,
        html: emailMarkup,
      });
      console.log("Email sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };


  const handleConfirmKitName = async () => {
    if (!tempKitName.trim()) return; // Don't proceed if kit name is empty

    // Update the selectedBrandKit with the new kit_name
    setSelectedBrandKit((prev: any) => ({
      ...prev,
      kit_name: tempKitName.trim(),
    }));

    setShowKitNameDialog(false);
    setTempKitName('');

    // Re-attempt to save the email with the new kit name
    if (emailToSaveRef.current) {
      await handleSaveEmail(emailToSaveRef.current.htmlContent, emailToSaveRef.current.title);
      emailToSaveRef.current = null;
    }
  };

  return (
    <div className="flex h-full bg-background ">
      <div className="flex flex-col w-1/2 min-h-0 ">
        {/* This main content area is the only part that scrolls */}
        <div className="flex-1 overflow-y-auto p-6 ">
          <div className="flex flex-col space-y-5">
            {messages.map((msg: ChatMessage, index) => {
              const isUser = msg.type === 'user';

              return (
                <div
                  key={msg.id} // Use msg.id for key
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} items-start`}>
                  {!isUser && (
                    <Image src="/icon.svg" alt="Bot Icon" width={32} height={32} className="mr-2" />
                  )}
                  {isUser ? (
                    <div className="max-w-lg">
                      <div className="rounded-2xl px-4 py-3 bg-muted text-muted-foreground shadow-sm">
                        <p className="text-sm">{(msg.content as UserMessageContent).emailContent}</p>
                      </div>
                      {(msg.content as UserMessageContent).brandKit && (
                        <div className="mt-2 p-2 rounded-2xl bg-muted text-card-foreground border shadow-sm flex items-center space-x-2 max-w-40 ml-auto">
                          {(msg.content as UserMessageContent).brandKit.logo_icon && (
                            <Image src={(msg.content as UserMessageContent).brandKit.logo_icon} alt="Brand Logo" width={24} height={24} className="rounded-full" />
                          )}
                          <span className="text-sm font-medium">{(msg.content as UserMessageContent).brandKit.kit_name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-lg">
                      {typeof msg.content === 'string' ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground break-words"><code>{msg.content}</code></pre>
                      ) : (
                        <>
                          {(msg.content as BotMessageContent).title && (
                            <div
                              className="rounded-lg w-80 p-3 border text-secondary-foreground shadow-sm mb-2 cursor-pointer hover:bg-accent flex items-center justify-between"
                              onClick={() => {
                                if ((msg.content as BotMessageContent).code) {
                                  setEmailMarkup((msg.content as BotMessageContent).code || '');
                                  setEmailTitle((msg.content as BotMessageContent).title || '');
                                }
                              }}
                            >
                              <p className="text-sm font-semibold">{(msg.content as BotMessageContent).title}</p>
                              {(msg.content as BotMessageContent).code && <Terminal className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          )}
                          {(msg.content as BotMessageContent).text && <p className="text-sm mt-5">{(msg.content as BotMessageContent).text}</p>}
                          {(msg.content as BotMessageContent).description && (
                            <p className="text-sm mt-2 text-muted-foreground">{(msg.content as BotMessageContent).description}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

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
      <div className="w-1/2 h-full bg-muted/30 overflow-hidden flex items-center justify-center rounedd-2xl"> 
        <EmailDisplayPanel emailMarkup={emailMarkup} isLoading={isLoading} emailTitle={emailTitle} onSave={handleSaveEmail} emailId={emailId} onShare={handleShareEmail} onSend={handleSendEmail} isSaving={isSaving} />
      </div>

      <Dialog open={showKitNameDialog} onOpenChange={setShowKitNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Brand/Website Name</DialogTitle>
            <DialogDescription>
              Please provide a name for your brand or website. This will be used to categorize your saved emails.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="kit-name"
              placeholder="e.g., My Awesome Brand"
              value={tempKitName}
              onChange={(e) => setTempKitName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowKitNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmKitName} disabled={!tempKitName.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}