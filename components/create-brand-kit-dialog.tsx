
"use client";

import { useState } from "react";
import {
  Dialog,  DialogContent,  DialogHeader,  DialogTitle, 
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FaSpinner, FaPlus } from "react-icons/fa";
import {FiLink} from "react-icons/fi"
import { TbMichelinStarGreen } from "react-icons/tb";
import { cn } from "@/lib/utils";

export function CreateBrandKitDialog({ open, onOpenChange }:any) {
  const [step, setStep] = useState("options"); // "options" | "match"
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMatchBrand = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brand-kit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      // Handle response
    } catch (error) {
      console.error("Error matching brand:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen:any) => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("options");
      }, 200); // Delay to allow fade-out animation to finish
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "bg-[#1a1a1a] text-neutral-50 border-neutral-800 rounded-2xl data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
          "max-w-lg"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            Set up your Brand Kit
          </DialogTitle>
        </DialogHeader>
        {step === "options" && (
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div
              className="h-80 flex flex-col items-center justify-center p-8 bg-neutral-800 rounded-2xl cursor-pointer transition-colors hover:bg-neutral-700"
              onClick={() => setStep("match")}
            >
              <FiLink className="w-8 h-8 mb-3 text-muted-foreground" />
              <h3 className="font-semibold text-base">Match my brand</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Automatically match your website's branding
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-8 bg-neutral-800 rounded-2xl cursor-pointer transition-colors hover:bg-neutral-700">
              <FaPlus className="w-8 h-8 mb-3 text-muted-foreground" />
              <h3 className="font-semibold text-base">Start from scratch</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Upload your own logos, colors, and branded assets
              </p>
            </div>
          </div>
        )}
        {step === "match" && (
          <div className="flex flex-col gap-3 pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter your website URL to get started.
            </p>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-secondary border-border text-foreground focus:ring-offset-background focus:ring-ring rounded-lg"
              />
              <Button
                onClick={handleMatchBrand}
                disabled={loading || !url || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                {loading ? (
                  <img src="/loader.svg" alt="Loading" className="w-8 h-8 animate-slow-spin" />
                ) : (
                  "Match Brand"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
