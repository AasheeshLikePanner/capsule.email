'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SendEmailCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipient: string, subject: string) => void;
  defaultSubject: string;
}

export default function SendEmailCard({ isOpen, onClose, onSend, defaultSubject }: SendEmailCardProps) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    setSubject(defaultSubject);
  }, [defaultSubject]);

  const handleSend = () => {
    if (recipient && subject) {
      onSend(recipient, subject);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="w-[400px] rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Send Email</CardTitle>
        <CardDescription>
          Enter the recipient's email and a subject line.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Input
            id="recipient"
            type="email"
            placeholder="email@example.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSend} disabled={!recipient || !subject}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}