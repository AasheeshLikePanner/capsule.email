"use client";
import { Monitor, Smartphone, Eye, Code, Copy, Download, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import dynamic from "next/dynamic";
import DarkEmailTemplate from "@/components/email-templates/dark-email-template"; // Import DarkEmailTemplate

export default function CombinedResponsivePreviewSample() {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  

  const renderDeviceFrame = (mode: string, content: React.ReactNode) => {
    switch (mode) {
      case 'desktop':
        return (
          <div className="w-full h-full border-2 border-gray-700 rounded-xl overflow-hidden flex flex-col shadow-xl bg-white text-black">
            <div className="flex-grow overflow-hidden">
              {content}
            </div>
          </div>
        );
      case 'tablet':
        return (
          <div className="w-1/2 h-[80%] border-2 border-gray-700 rounded-lg overflow-hidden flex flex-col shadow-xl bg-white text-black">
            <div className="flex-grow overflow-hidden">
              {content}
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="w-1/3 h-[60%] border-2 border-gray-700 rounded-md overflow-hidden flex flex-col shadow-xl bg-white text-black">
            <div className="flex-grow overflow-hidden">
              {content}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 border border-border rounded-lg bg-background text-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('preview')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={ 'ghost'}
            size="sm"
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
        </div>
      </div>

      <div className="flex-grow relative overflow-hidden rounded-lg border flex items-center justify-center">
        
          <div className={`bg-white ${deviceMode === 'mobile' ? 'w-80 h-[80%]  rounded-lg' : 'w-full h-full'}`}>
            <DarkEmailTemplate /> {/* Render DarkEmailTemplate component */}
          </div>
      
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <Button size="sm" variant="outline">
          <Copy className="w-3.5 h-3.5 mr-1" /> Copy
        </Button>
        <Button size="sm" variant="outline">
          <Download className="w-3.5 h-3.5 mr-1" /> Download
        </Button>
      </div>
    </div>
  );
}
