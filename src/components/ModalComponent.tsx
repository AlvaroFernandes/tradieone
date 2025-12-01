import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ModalComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  site?: string;
  children: React.ReactNode; // The form or any content
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | string;
  type?: "add" | "edit" | "view" | "delete" | "";
}

const sizeMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  // 80% of viewport width — use important utilities to override defaults
  w80: "w-[80vw] max-w-[80vw] sm:!max-w-[80vw]",
};

export function ModalComponent({ open, onOpenChange, title, site, children, description, size = "xl", type }: ModalComponentProps) {
  const sizeClass = sizeMap[size] || size;

  // Log modal info only when the modal opens to help identify which instance
  // produced the message (title/type/size), avoiding noisy logs from renders
  // or StrictMode double-mounting.
  React.useEffect(() => {
    if (open) {
      console.log("Modal open:", { title, type: type || "(no-type)", size, sizeClass });
    }
  }, [open, title, type, size, sizeClass]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClass}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {site && <div className="text-xs text-gray-500 mb-2">Site: {site}</div>}
          <DialogDescription>{description || ""}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default ModalComponent;
