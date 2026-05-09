import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

const Sheet = ({ open, onOpenChange, children }) => {
  const ANIMATION_DURATION = 300;

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
        style={{
          opacity: open ? 1 : 0,
          transition: `opacity ${ANIMATION_DURATION}ms ease-out`,
          pointerEvents: open ? "auto" : "none",
        }}
      />
      {/* Content */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${ANIMATION_DURATION}ms ease-out`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {children}
      </div>
    </>
  );
};

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 p-4 border-b", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold text-gray-900", className)} {...props} />
);
SheetTitle.displayName = "SheetTitle";

const SheetContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col h-full", className)} {...props}>
      {children}
    </div>
  )
);
SheetContent.displayName = "SheetContent";

const SheetClose = ({ className, ...props }) => (
  <button
    className={cn(
      "absolute right-4 top-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
);
SheetClose.displayName = "SheetClose";

export { Sheet, SheetHeader, SheetTitle, SheetContent, SheetClose };
