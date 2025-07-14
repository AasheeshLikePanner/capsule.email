import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface BrandKitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandKitDialog({ isOpen, onOpenChange }: BrandKitDialogProps) {
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
          {/* Placeholder for Brand Kit content */}
          <p>Brand Kit content goes here.</p>
          <p>You can add forms, color pickers, etc.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}