import { render } from "@react-email/render";
import { Email } from "@/components/email";
import { useState, useEffect, useRef } from 'react';

export default function EmailPreview({ initialMarkup, brandKit }: { initialMarkup?: string; brandKit?: any }) {
  const [emailHtml, setEmailHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let isMounted = true;
    const generateHtml = async () => {
      if (initialMarkup) {
        if (isMounted) {
          setEmailHtml(initialMarkup);
        }
      } else if (brandKit) {
        try {
          const htmlContent: string = await render(<Email brandKit={brandKit} />);
          if (isMounted) {
            setEmailHtml(htmlContent);
          }
        } catch (error) {
          console.error("Error rendering email:", error);
          if (isMounted) {
            setEmailHtml("Error rendering email preview.");
          }
        }
      }
    };

    generateHtml();

    return () => {
      isMounted = false;
    };
  }, [initialMarkup, brandKit]);

  useEffect(() => {
    if (iframeRef.current && emailHtml) {
      const iframeDoc = iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        const scrollbarStyles = `
          <style>
            ::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 3px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.4);
            }
            /* For dark mode */
            .dark ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
            }
            .dark ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.4);
            }
            body {
              overflow: auto !important; /* Ensure scrollbar appears */
            }
          </style>
        `;
        const fullHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            ${scrollbarStyles}
          </head>
          <body>
            ${emailHtml}
          </body>
          </html>
        `;
        iframeDoc.write(fullHtml);
        iframeDoc.close();
      }
    }
  }, [emailHtml]);

  return (
    <div className="w-full h-full bg-muted/20 p-4 rounded-3xl">
      <iframe ref={iframeRef} className="w-full h-full border-none rounded-3xl" />
    </div>
  );
}