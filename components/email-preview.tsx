import { Email } from "@/components/email";
import { useState, useEffect } from 'react';

export default function EmailPreview({ initialMarkup, brandKit }: { initialMarkup?: string; brandKit?: any }) {
  const [emailContent, setEmailContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (initialMarkup) {
      // If initialMarkup is provided, render it directly as HTML
      setEmailContent(<div dangerouslySetInnerHTML={{ __html: initialMarkup }} />);
    } else if (brandKit) {
      // If brandKit is provided, render the Email component
      setEmailContent(<Email brandKit={brandKit} />);
    }
  }, [initialMarkup, brandKit]);

  return (
    <div className="w-full h-full rounded-3xl overflow-auto">
      {emailContent}
    </div>
  );
}
