
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateBrandKitDialog } from "@/components/create-brand-kit-dialog";

export default function BrandKitPage() {
  const [brandKitExists, setBrandKitExists] = useState(false); // This would be fetched from your backend
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-10">
      {brandKitExists ? (
        <div>
          {/* Display brand kits here */}
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
            Create Brand Kit
          </Button>
        </div>
      </div>
      )}
      <CreateBrandKitDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
