

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useBrandKitStore } from "@/lib/store/brandKitStore";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

import Image from "next/image";


import { Card } from "./ui/card";

interface BrandKit {
  id: string;
  kit_name: string;
  logo_primary: string | null;
  // Add other brand kit properties as needed
}

interface BrandKitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBrandKit: (brandKit: BrandKit) => void;
}

export function BrandKitDialog({ isOpen, onOpenChange, onSelectBrandKit }: BrandKitDialogProps) {
  const { brandKits, isLoading, error, fetchBrandKits } = useBrandKitStore();
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchBrandKits();
    }
  }, [isOpen, fetchBrandKits]);

  const handleSelect = (kit: BrandKit) => {
    onSelectBrandKit(kit);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Brand Kit</DialogTitle>
          <DialogDescription>
            Manage your brand&#39;s colors, fonts, and logos here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading && (
            <div className="flex justify-center items-center h-20">
              <Image
                src="/icon.svg"
                alt="Loading"
                width={40}
                height={40}
                className="animate-spin-slow"
              />
            </div>
          )}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!isLoading && !error && brandKits.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <p className="text-muted-foreground text-sm mb-4">
                No brand kits found.
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false); // Close the dialog
                  router.push('/brand-kit');
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded-xl"
              >
                Create Brand Kit
              </Button>
            </div>
          )}
          {!isLoading && !error && brandKits.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {brandKits.map((kit) => (
                <div
                  key={kit.id}
                  className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => handleSelect(kit)}
                >
                  {kit.logo_primary && (
                    <Image
                      src={kit.logo_primary}
                      alt={`${kit.kit_name} Logo`}
                      width={40}
                      height={40}
                      objectFit="contain"
                    />
                  )}
                  <span>{kit.kit_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}