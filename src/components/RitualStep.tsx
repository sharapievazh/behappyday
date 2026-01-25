import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RitualStepProps {
  id: string;
  title: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  delay?: number;
}

export function RitualStep({ 
  id, 
  title, 
  description, 
  checked = false, 
  onCheckedChange,
  delay = 0 
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
