import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ModalComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  site?: string;
  children: React.ReactNode; // The form or any content
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | string;
  type?: "add" | "edit";
}

const sizeMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function ModalComponent({ open, onOpenChange, title, site, children, description, size = "xl" }: ModalComponentProps) {
  const sizeClass = sizeMap[size] || size;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClass}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {site && <div className="text-xs text-gray-500 mb-2">Site: {site}</div>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default ModalComponent;
