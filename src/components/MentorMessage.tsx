import { cn } from "@/lib/utils";

interface MentorMessageProps {
  message: string;
  className?: string;
}

export function MentorMessage({ message, className }: MentorMessageProps) {
  return (
    <div className={cn("mentor-card animate-fade-in", className)}>
      <p className="text-mentor">« {message} »</p>
    </div>
  );
}
