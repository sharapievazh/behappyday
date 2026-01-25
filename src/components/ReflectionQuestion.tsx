import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReflectionQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

export function ReflectionQuestion({ 
  question, 
  value, 
  onChange,
  delay = 0 
}: ReflectionQuestionProps) {
  return (
    <div 
      className="space-y-3 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <label className="text-base font-medium text-foreground">
        {question}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Напиши здесь..."
        className={cn(
          "min-h-[80px] resize-none rounded-xl border-border",
          "bg-card focus:border-primary focus:ring-1 focus:ring-primary",
          "placeholder:text-muted-foreground/50"
        )}
      />
    </div>
  );
}
