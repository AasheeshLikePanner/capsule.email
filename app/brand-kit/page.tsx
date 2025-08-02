
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreateBrandKitDialog } from "@/components/create-brand-kit-dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useBrandKitStore } from "@/lib/store/brandKitStore";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Trash2 } from "lucide-react";
import { useRef, useCallback } from "react";

export default function BrandKitPage() {
  const { brandKits, isLoading, error, fetchBrandKits, deleteBrandKit } = useBrandKitStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessingBrandKit, setIsProcessingBrandKit] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [kitToDelete, setKitToDelete] = useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredDelete = useRef(false);
  const DELETE_DURATION = 1500; // milliseconds to hold the button for delete

  useEffect(() => {
    fetchBrandKits();
  }, [fetchBrandKits]);

  useEffect(() => {
    if (kitToDelete) {
      handleDelete(kitToDelete);
      setKitToDelete(null);
    }
  }, [kitToDelete]);

  const handleBrandKitProcessingStart = () => {
    setIsProcessingBrandKit(true);
    setIsDialogOpen(false); // Close the dialog immediately
  };

  const handleBrandKitProcessingComplete = (success: boolean, message: string) => {
    setIsProcessingBrandKit(false);
    if (success) {
      toast.success(message);
      fetchBrandKits(); // Re-fetch brand kits to show the new one
    } else {
      toast.error(message);
    }
  };

  const handleDelete = async (kitId: string) => {
    try {
      await deleteBrandKit(kitId);
      toast.success("Brand kit deleted successfully");
    } catch (error) {
      toast.error("Failed to delete brand kit");
    }
  };

  const handleMouseDownDelete = useCallback((kitId: string) => {
    setDeleteProgress(0);
    hasTriggeredDelete.current = false;

    progressIntervalRef.current = setInterval(() => {
      setDeleteProgress((prevProgress) => {
        const newProgress = prevProgress + (1000 / DELETE_DURATION);
        if (newProgress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          if (!hasTriggeredDelete.current) {
            hasTriggeredDelete.current = true;
            setKitToDelete(kitId);
          }
          return 100;
        }
        return newProgress;
      });
    }, 10);
  }, [handleDelete]);

  const handleMouseUpDelete = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setDeleteProgress(0);
    hasTriggeredDelete.current = false;
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-foreground">Brand Kit</h1>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded-xl"
          onClick={() => setIsDialogOpen(true)}
        >
          Create
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <Image
            src="/icon.svg"
            alt="Loading Spinner"
            width={64}
            height={64}
            className="animate-spin"
          />
          <p className="mt-4 text-lg font-semibold text-foreground">Loading brand kits...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-red-500">
          <p className="text-lg font-semibold">Error: {error}</p>
          <p>Please try again later.</p>
        </div>
      ) : brandKits.length === 0 && !isProcessingBrandKit ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-foreground">
              No Brand Kits Yet
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Set your logo, colors, and type once to reuse them across all your
              email templates and stay on-brand every time.
            </p>
            <Button
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-6 rounded-xl"
              onClick={() => setIsDialogOpen(true)}
            >
              Create
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2 sm:p-4 lg:p-6">
          {isProcessingBrandKit && (
            <Card className="bg-muted/20 text-white p-6 rounded-xl h-80 w-full shadow-lg relative flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/icon.svg"
                  alt="Processing Spinner"
                  width={64}
                  height={64}
                  className="animate-spin-slow"
                />
                <p className="mt-4 text-lg font-semibold text-foreground">Processing your brand kit...</p>
              </div>
            </Card>
          )}
          {brandKits.map((kit) => (
            <div key={kit.id} className="group relative">
              <Card className="bg-muted/20 text-white p-6 rounded-xl w-full h-80 shadow-lg relative overflow-hidden">
                <Link href={`/email-editor/${kit.id}`}>
                  <CardContent className="flex items-center justify-center h-full cursor-pointer">
                    {kit.logo_primary && (
                      <Image
                        src={kit.logo_primary}
                        alt={`${kit.kit_name} Logo`}
                        width={100}
                        height={100}
                        objectFit="contain"
                        className="transition-all duration-300 group-hover:filter-none filter grayscale"
                      />
                    )}
                  </CardContent>
                </Link>
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDownDelete(kit.id);
                  }}
                  onMouseUp={handleMouseUpDelete}
                  onMouseLeave={handleMouseUpDelete}
                >
                  <div
                    className="absolute inset-0 bg-red-500/20 transition-all duration-100 ease-linear rounded-md"
                    style={{ width: `${deleteProgress}%` }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </span>
                </Button>
              </Card>
            </div>
          ))}
        </div>
      )}
      <CreateBrandKitDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onProcessingStart={handleBrandKitProcessingStart} onProcessingComplete={handleBrandKitProcessingComplete} />
    </div>
  );
}
