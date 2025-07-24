
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

export default function BrandKitPage() {
  const { brandKits, isLoading, error, fetchBrandKits } = useBrandKitStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessingBrandKit, setIsProcessingBrandKit] = useState(false);

  useEffect(() => {
    fetchBrandKits();
  }, [fetchBrandKits]);

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

  return (
    <div className="p-10 py-5 min-h-screen">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-24">
          {isProcessingBrandKit && (
            <Card className="bg-muted/20 text-white p-6 rounded-xl h-80 w-96 shadow-lg relative flex items-center justify-center">
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
          {brandKits.length > 0 ? (
            brandKits.map((kit) => (
              <Link href={`/email-editor/${kit.id}`} key={kit.id} className="group">
                <Card className="bg-muted/20 text-white p-6 rounded-xl w-96 h-80 shadow-lg relative overflow-hidden">
                  <CardContent className="flex items-center justify-center h-full">
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
                </Card>
              </Link>
            ))
          ) : (
            !isProcessingBrandKit && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] col-span-full">
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
            )
          )}
        </div>
      )}
      <CreateBrandKitDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onProcessingStart={handleBrandKitProcessingStart} onProcessingComplete={handleBrandKitProcessingComplete} />
    </div>
  );
}
