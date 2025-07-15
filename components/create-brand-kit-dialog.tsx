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
import { FaPlus, FaSpinner } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";

export function CreateBrandKitDialog({
  open,
  onOpenChange,
  onProcessingChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessingChange: (processing: boolean) => void;
}) {
  const [step, setStep] = useState("options"); // "options" | "match"
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMatchBrand = async () => {
    setLoading(true);
    onProcessingChange(true); // Set processing to true when API call starts
    const timeoutId = setTimeout(() => {
      onOpenChange(false);
    }, 5000);

    try {
      const response = await axios.post("/api/brand-kit", { url });
      console.log(response);

      const jsonString = response.data.emailTemplate
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "");

      if (!jsonString) {
        console.error("emailTemplate is undefined or null in response.data");
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (_error: any) {
        return;
      }

      const data = parsedData.component;
      console.log(data);
      clearTimeout(timeoutId); // Clear the timeout if the API call finishes before 5 seconds
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error("Error matching brand:", error); // This should now catch the JSON.parse error
      clearTimeout(timeoutId); // Clear the timeout on error as well
    } finally {
      setLoading(false);
      onProcessingChange(false);
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
          <div className="grid grid-cols-2 gap-4 pt-4">
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
            <Link href="/email-editor">
              <div className="h-80 flex flex-col items-center justify-center p-8 bg-neutral-800 rounded-2xl cursor-pointer transition-colors hover:bg-neutral-700">
                <FaPlus className="w-8 h-8 mb-3 text-muted-foreground" />
                <h3 className="font-semibold text-base">Start from scratch</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Upload your own logos, colors, and branded assets
                </p>
              </div>
            </Link>
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
                disabled={
                  loading || !url || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                {loading ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FaSpinner className="animate-spin" />
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
