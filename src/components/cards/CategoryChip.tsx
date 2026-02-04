import { cn } from "@/lib/utils";

interface CategoryChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ label, isActive = false, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-4 py-2 rounded-full text-meta font-medium transition-all touch-target",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
    >
      {label}
    </button>
  );
}
