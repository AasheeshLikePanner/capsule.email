"use client";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export default function ResponsiveSample() {
  return (
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
  );
}
