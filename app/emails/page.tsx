'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Image from 'next/image';
import { Trash2Icon, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EmailDisplayPanel from '@/components/email-display-panel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useMediaQuery } from '@/lib/hooks/use-media-query';

interface Email {
  id: string;
  name: string;
  html_content: string;
  created_at: string;
  kit_name?: string; // Add kit_name to the interface
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailMarkup, setEmailMarkup] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingEmail, setIsDeletingEmail] = useState(false); // New state for delete loading
  const [searchTerm, setSearchTerm] = useState('');
  const isDesktop = useMediaQuery("(min-width: 1024px)"); 

  const handleUpdateEmail = useCallback(async (htmlContent: string, title: string): Promise<boolean> => {
    if (!selectedEmail?.id) return false; // Cannot update without an email ID

    setIsSaving(true);
    try {
      const response = await fetch(`/api/emails/${selectedEmail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html_content: htmlContent, name: title }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the email in the local state after successful update
      setEmails(prevEmails =>
        prevEmails.map(email =>
          email.id === selectedEmail.id ? { ...email, html_content: htmlContent, name: title } : email
        )
      );
      setSelectedEmail(prev => prev ? { ...prev, html_content: htmlContent, name: title } : null);

      console.log("Email updated successfully");
      return true;
    } catch (e: any) {
      setError(e.message);
      console.error("Error updating email:", e);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [selectedEmail]);

  const handleDelete = useCallback(async () => {
    if (!emailToDelete) return;

    setIsDeletingEmail(true); // Set loading state
    try {
      const response = await fetch(`/api/emails/${emailToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEmails(emails.filter((email) => email.id !== emailToDelete.id));
      setShowDeleteDialog(false);
      setEmailToDelete(null);
      if (selectedEmail?.id === emailToDelete.id) {
        setSelectedEmail(null);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsDeletingEmail(false); // Reset loading state
    }
  }, [emailToDelete, emails, selectedEmail]);

  const handleRowClick = useCallback((email: Email) => {
    setSelectedEmail(email);
    setEmailMarkup(email.html_content);
    setEmailTitle(email.name);
  }, []);

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get('/api/emails');
        
        const data = await response.data;
        setEmails(data);
      } catch (e:any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmails();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Image src="/icon.svg" alt="Loading..." width={48} height={48} className="animate-spin-slow" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
  }

  const filteredEmails = emails.filter(email =>
    email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (email.kit_name && email.kit_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ResizablePanelGroup direction={isDesktop ? "horizontal" : "vertical"} onLayout={(sizes: number[]) => {
      document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
    }} className="min-h-[calc(100vh-64px)] w-full p-4 sm:p-6 md:p-8">
      <ResizablePanel defaultSize={50} minSize={20} className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl font-medium text-foreground mb-4 sm:mb-0">My Emails</h1>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm pl-8 rounded-3xl pr-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="flex flex-col h-full p-4">
          {filteredEmails.length === 0 ? (
            <p className="text-center text-muted-foreground flex-1 flex items-center justify-center">No emails found.</p>
          ) : (
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow
                      key={email.id}
                      onClick={() => handleRowClick(email)}
                      className={selectedEmail?.id === email.id ? "bg-muted/50 cursor-pointer" : "cursor-pointer"}
                    >
                      <TableCell className="font-medium py-2">{email.name}</TableCell>
                      <TableCell className="py-2">{email.kit_name || 'N/A'}</TableCell>
                      <TableCell className="py-2">{format(new Date(email.created_at), 'PPP')}</TableCell>
                      <TableCell className="text-right py-2">
                        
                        <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click from firing
                                setEmailToDelete(email);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2Icon className="mr-1" />Delete
                            </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className='bg-justworking'/>
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex flex-col h-full bg-muted/30 rounded-3xl p-4">
          {selectedEmail ? (
            <EmailDisplayPanel
              emailMarkup={emailMarkup}
              isLoading={false}
              emailTitle={emailTitle}
              onSave={handleUpdateEmail}
              emailId={selectedEmail?.id || null}
              onShare={(id) => {
                const shareableLink = `${window.location.origin}/emails/${id}`;
                navigator.clipboard.writeText(shareableLink);
                console.log("Shareable link copied:", shareableLink);
              }}
              onSend={async () => {
                // TODO: Implement send functionality if needed
                console.log("Send functionality not implemented on this page.");
              }}
              isSaving={isSaving}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select an email from the list to view its preview.
            </div>
          )}
        </div>
      </ResizablePanel>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              email and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeletingEmail}>
              {isDeletingEmail ? (
                <>
                  <Image src="/icon.svg" alt="Loading" width={20} height={20} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResizablePanelGroup>
  );
}
