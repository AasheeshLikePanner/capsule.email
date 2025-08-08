"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FaPlus } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import { useBrandKitStore } from "@/lib/store/brandKitStore";
import { createBrandKit, createEmptyBrandKit } from "@/lib/actions/brand-kit";

export function CreateBrandKitDialog({
  open,
  onOpenChange,
  onProcessingStart,
  onProcessingComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessingStart: () => void;
  onProcessingComplete: (success: boolean, message: string) => void;
}) {
  const { addBrandKit } = useBrandKitStore();
  const [step, setStep] = useState("options"); // "options" | "match"
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEmptyBrandKit = async () => {
    setLoading(true);
    onProcessingStart();
    try {
      const newBrandKitId = await createEmptyBrandKit();
      onOpenChange(false);
      onProcessingComplete(true, "Empty brand kit created!");
      window.location.href = `/email-editor/${newBrandKitId}`;
    } catch (error: any) {
      console.error("Error creating empty brand kit:", error);
      onProcessingComplete(false, error.message || "Failed to create empty brand kit.");
    } finally {
      setLoading(false);
    }
  };

  const handleMatchBrand = async () => {
    setLoading(true);
    onProcessingStart(); // Notify parent that processing has started
    try {
      const newBrandKit = await createBrandKit(url);
      addBrandKit(newBrandKit); // Pass the complete brand kit data
      onOpenChange(false); // Close dialog on success
      onProcessingComplete(true, "Brand kit created successfully!");
    } catch (error: any) {
      console.error("Error matching brand:", error);
      onProcessingComplete(false, error.response?.data?.error || "Failed to create brand kit.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("options");
      }, 200);
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
          <div className="grid grid-cols-2 gap-2 pt-4">
            <div
              className="h-80 flex flex-col items-center justify-center p-8 bg-neutral-800 rounded-2xl cursor-pointer transition-colors hover:bg-neutral-700"
              onClick={() => setStep("match")}
            >
              <FiLink className="w-8 h-8 mb-3 text-muted-foreground" />
              <h3 className="font-semibold text-base">Match my brand</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Automatically match your website&#39;s branding
              </p>
            </div>
            <div
              className="h-80 flex flex-col items-center justify-center p-8 bg-neutral-800 rounded-2xl cursor-pointer transition-colors hover:bg-neutral-700"
              onClick={handleCreateEmptyBrandKit}
            >
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
                className="bg-card/75 border-border text-foreground focus:ring-offset-background focus:ring-ring rounded-lg"
              />
              <Button
                onClick={handleMatchBrand}
                disabled={
                  loading || !url || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                {loading ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/icon.svg"
                      alt="Loading"
                      width={32}
                      height={32}
                      className="animate-spin-slow"
                    />
                  </div>
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
