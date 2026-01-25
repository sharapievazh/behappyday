import { Button } from "@/components/ui/button";
import { Check, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DayClosedButtonProps {
  onClose: () => void;
}

export function DayClosedButton({ onClose }: DayClosedButtonProps) {
  const [closed, setClosed] = useState(false);

  const handleClose = () => {
    setClosed(true);
    onClose();
  };

  if (closed) {
    return (
      <div className="text-center animate-scale-in space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success">
          <Check className="w-8 h-8 text-success-foreground" />
        </div>
        <p className="font-serif text-2xl text-foreground">
          Молодец! День прожит с любовью к себе.
        </p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClose}
      size="lg"
      className={cn(
        "w-full h-14 text-lg font-medium rounded-2xl",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "shadow-soft transition-all duration-300 hover:shadow-card",
        "flex items-center gap-3"
      )}
    >
      <Moon className="w-5 h-5" />
      День закрыт
    </Button>
  );
}
