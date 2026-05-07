import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState, type ComponentType } from "react";

interface RitualStepProps {
  id: string;
  title: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  delay?: number;
  icon?: ComponentType<{ className?: string }>;
}

export function RitualStep({ 
  id, 
  title, 
  description, 
  checked = false, 
  onCheckedChange,
  delay = 0,
  icon: Icon,
}: RitualStepProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (value: boolean) => {
    setIsChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <div 
      className="ritual-step animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Checkbox
        id={id}
        checked={isChecked}
        onCheckedChange={handleChange}
        className={cn(
          "h-6 w-6 rounded-lg border-2 transition-all duration-300",
          isChecked && "bg-success border-success animate-check-bounce"
        )}
      />
      {Icon && (
        <span className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary transition-colors flex-shrink-0",
          isChecked && "bg-success/15 text-success"
        )}>
          <Icon className="w-4 h-4" />
        </span>
      )}
      <div className="flex-1">
        <label 
          htmlFor={id} 
          className={cn(
            "text-base font-medium cursor-pointer transition-all duration-300",
            isChecked && "text-muted-foreground line-through"
          )}
        >
          {title}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
