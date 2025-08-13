"use client";
import { Eye, Code, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmailRender from "@/components/email-render";
import { Monitor, Tablet, Smartphone } from "lucide-react";


export default function PreviewSample() {
  const sampleHtml = `
    <div style="background-color: #f0f0f0; padding: 20px; font-family: sans-serif;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; text-align: center;">
        <h1 style="color: #333;">Welcome!</h1>
        <p style="color: #555;">Thanks for joining our platform.</p>
        <a href="#" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Get Started</a>
      </div>
    </div>
  `;

  return (
    <div className="w-full p-4 border border-border rounded-lg bg-background flex flex-col gap-4 text-sm overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant='secondary'
            size="sm"
            className="text-black"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant='ghost'
            size="sm"
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-lg border">
        <div className="w-full p-4 border border-border rounded-lg bg-background flex flex-col items-center gap-4 text-sm overflow-hidden">
      <div className="flex gap-4 text-muted-foreground">
        <Monitor className="w-7 h-7" />
        <Tablet className="w-6 h-6" />
        <Smartphone className="w-5 h-5" />
      </div>
      <div className="w-full flex justify-center items-end gap-3 h-40">
        {/* Desktop View */}
        <div className="w-1/2 h-full border-2 border-border bg-card rounded-xl overflow-hidden flex flex-col p-3 shadow-lg">
          <div className="w-full h-5 bg-primary/80 rounded-sm mb-2"></div>
          <div className="w-3/4 h-2.5 bg-muted rounded-sm mb-1"></div>
          <div className="w-1/2 h-2.5 bg-muted rounded-sm"></div>
          <div className="w-full h-16 bg-muted/50 rounded-sm mt-3"></div>
        </div>
        {/* Tablet View */}
        <div className="w-1/4 h-[80%] border-2 border-border bg-card rounded-lg overflow-hidden flex flex-col p-2 shadow-lg">
          <div className="w-full h-4 bg-primary/80 rounded-sm mb-1.5"></div>
          <div className="w-3/4 h-2 bg-muted rounded-sm mb-0.5"></div>
          <div className="w-1/2 h-2 bg-muted rounded-sm"></div>
          <div className="w-full h-10 bg-muted/50 rounded-sm mt-2"></div>
        </div>
        {/* Mobile View */}
        <div className="w-1/6 h-[60%] border-2 border-border bg-card rounded-md overflow-hidden flex flex-col p-1 shadow-lg">
          <div className="w-full h-3 bg-primary/80 rounded-sm mb-1"></div>
          <div className="w-3/4 h-1.5 bg-muted rounded-sm"></div>
          <div className="w-full h-8 bg-muted/50 rounded-sm mt-1"></div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
