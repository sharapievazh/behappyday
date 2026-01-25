import { cn } from "@/lib/utils";

interface MentorMessageProps {
  message: string;
  className?: string;
}

export function MentorMessage({ message, className }: MentorMessageProps) {
  return (
    <div className={cn(
      "mentor-message p-4 rounded-xl bg-primary/10 border border-primary/20",
      "text-sm text-foreground/80 italic",
      className
    )}>
      <p>💬 {message}</p>
    </div>
  );
}