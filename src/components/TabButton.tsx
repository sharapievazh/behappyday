import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ icon: Icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300",
        active 
          ? "bg-primary text-primary-foreground shadow-soft" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
