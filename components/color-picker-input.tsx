"use client";

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface ColorPickerInputProps {
  color: string;
  onChange: (newColor: string) => void;
  label: string;
  description: string;
}

export default function ColorPickerInput({
  color,
  onChange,
  label,
  description,
}: ColorPickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-start space-y-2 cursor-pointer">
          <div
            className={cn(
              "h-72 w-72 rounded-3xl border-none focus:ring-0 focus:ring-offset-0",
              "flex items-center justify-center" // To center the color if it's a small dot
            )}
            style={{ backgroundColor: color }}
            onClick={() => setIsOpen(true)}
          >
            {/* Optional: Add a small icon or text inside the swatch if needed */}
          </div>
          <Label className="pt-2">{label}</Label>
          <p className="text-xs text-muted-foreground text-center">{description}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select {label} Color</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
