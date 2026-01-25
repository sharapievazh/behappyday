import { cn } from "@/lib/utils";

interface AffirmationProps {
  text: string;
  className?: string;
}

export function Affirmation({ text, className }: AffirmationProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-2xl p-6 text-center animate-scale-in",
      "shadow-soft",
      className
    )}>
      <p className="font-serif text-xl text-foreground leading-relaxed">
        {text}
      </p>
    </div>
  );
}
