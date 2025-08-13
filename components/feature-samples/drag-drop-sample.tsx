"use client";
import { GripVertical, LayoutTemplate, Image as ImageIcon, Type } from "lucide-react";

export default function DragDropSample() {
  return (
    <div className="w-full p-4 border border-border rounded-lg bg-background flex gap-4 text-sm">
      <div className="w-1/3 flex flex-col gap-2 p-2 border-r border-border">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <LayoutTemplate className="w-4 h-4 text-primary" />
          <span className="text-foreground">Layout</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <ImageIcon className="w-4 h-4 text-primary" />
          <span className="text-foreground">Image</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Type className="w-4 h-4 text-primary" />
          <span className="text-foreground">Text</span>
        </div>
      </div>
      <div className="w-2/3 p-2 border border-dashed border-muted-foreground rounded-md flex items-center justify-center text-sm text-muted-foreground bg-muted/20">
        <p>Drag elements here</p>
      </div>
    </div>
  );
}
