import { Email } from "@/components/email";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

export default function EmailPreview({ initialMarkup, brandKit, className }: { initialMarkup?: string; brandKit?: any; className?: string }) {
  const [emailContent, setEmailContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (initialMarkup) {
      setEmailContent(<div dangerouslySetInnerHTML={{ __html: initialMarkup }} />);
    } else if (brandKit) {
      setEmailContent(<Email brandKit={brandKit} />);
    }
  }, [initialMarkup, brandKit]);

  return (
    <div className={cn("w-full h-full rounded-3xl overflow-auto", className)}>
      {emailContent}
    </div>
  );
}
