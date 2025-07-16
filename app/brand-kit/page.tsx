
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreateBrandKitDialog } from "@/components/create-brand-kit-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function BrandKitPage() {
  const [brandKits, setBrandKits] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessingBrandKit, setIsProcessingBrandKit] = useState(false);
  const [isLoadingBrandKits, setIsLoadingBrandKits] = useState(true);
  const [errorFetchingBrandKits, setErrorFetchingBrandKits] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandKits = async () => {
      try {
        const response = await fetch('/api/brand-kit');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBrandKits(data);
      } catch (error: any) {
        console.error("Error fetching brand kits:", error);
        setErrorFetchingBrandKits(error.message);
      } finally {
        setIsLoadingBrandKits(false);
      }
    };

    fetchBrandKits();
  }, []);

  const handleBrandKitProcessingStart = () => {
    setIsProcessingBrandKit(true);
    setIsDialogOpen(false); // Close the dialog immediately
  };

  const handleBrandKitComplete = (newBrandKit: any) => {
    setBrandKits((prev) => [...prev, newBrandKit]);
    setIsProcessingBrandKit(false);
  };

  return (
    <div className="w-full p-10  py-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-foreground">Brand Kit</h1>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded-xl"
          onClick={() => setIsDialogOpen(true)}
        >
          Create
        </Button>
      </div>

      {isLoadingBrandKits ? (
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
      ) : errorFetchingBrandKits ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-red-500">
          <p className="text-lg font-semibold">Error: {errorFetchingBrandKits}</p>
          <p>Please try again later.</p>
        </div>
      ) : isProcessingBrandKit ? (
        <Card className="bg-muted/20 text-white p-6 rounded-xl h-80 shadow-lg relative flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Image
              src="/icon.svg"
              alt="Processing Spinner"
              width={64}
              height={64}
              className="animate-spin"
            />
            <p className="mt-4 text-lg font-semibold text-foreground">Processing your brand kit...</p>
          </div>
        </Card>
      ) : brandKits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-20">
          {brandKits.map((kit) => (
            <Link href={`/email-editor/${kit.id}`} key={kit.id}>
              <Card className="bg-muted/20 text-white p-6 rounded-xl h-80 shadow-lg relative">
                <CardContent className="flex items-center justify-center h-full">
                  {kit.logo_primary && (
                    <Image
                      src={kit.logo_primary}
                      alt={`${kit.kit_name} Logo`}
                      width={100}
                      height={100}
                      objectFit="contain"
                    />
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
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
      )}
      <CreateBrandKitDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onProcessingStart={handleBrandKitProcessingStart} onBrandKitComplete={handleBrandKitComplete} />
    </div>
  );
}
