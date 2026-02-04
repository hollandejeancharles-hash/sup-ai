import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export function MobileContainer({ 
  children, 
  className,
  withBottomNav = true 
}: MobileContainerProps) {
  return (
    <div 
      className={cn(
        "min-h-screen bg-background",
        withBottomNav && "pb-20",
        className
      )}
    >
      <div className="container px-4">
        {children}
      </div>
    </div>
  );
}
