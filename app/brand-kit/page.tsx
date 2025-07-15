
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateBrandKitDialog } from "@/components/create-brand-kit-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function BrandKitPage() {
  const [brandKits, setBrandKits] = useState([
    { id: 1, name: "My Awesome Brand", logo: "/icon.svg", isProcessing: false },
    { id: 2, name: "Another Brand", logo: "/icon.svg", isProcessing: false },
    { id: 3, name: "Third Brand", logo: "/icon.svg", isProcessing: true }, // Example of a processing kit
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProcessingChange = (isProcessing: boolean) => {
    if (isProcessing) {
      setBrandKits((prev) => [
        ...prev,
        { id: Date.now(), name: "New Brand Kit", logo: "", isProcessing: true },
      ]);
    } else {
      setBrandKits((prev) =>
        prev.map((kit) =>
          kit.isProcessing ? { ...kit, isProcessing: false } : kit
        )
      );
    }
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

      {brandKits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-20">
          {brandKits.map((kit) => (
            <Card key={kit.id} className="bg-muted/20 text-white p-6 rounded-xl h-80 shadow-lg relative">
              {kit.isProcessing && (
                <div className="absolute top-2 right-2 bg-muted/40 border text-white text-xs px-2 py-1 rounded-full z-10">
                  Processing
                </div>
              )}
              <CardContent className="flex items-center justify-center h-full">
                {kit.isProcessing ? (
                  <Image
                    src="/icon.svg"
                    alt="Processing"
                    width={50}
                    height={50}
                    className="animate-spin-slow opacity-50"
                  />
                ) : (
                  kit.logo && (
                    <Image
                      src={kit.logo}
                      alt={`${kit.name} Logo`}
                      width={100}
                      height={100}
                      objectFit="contain"
                      className="grayscale"
                    />
                  )
                )}
              </CardContent>
            </Card>
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
      <CreateBrandKitDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onProcessingChange={handleProcessingChange} />
    </div>
  );
}
