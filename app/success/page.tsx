"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background text-foreground p-8 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-medium mb-3">
          Subscription Confirmed
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to Pro. You can now access all premium features.
        </p>
        <Button asChild>
          <Link href="/create">
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
