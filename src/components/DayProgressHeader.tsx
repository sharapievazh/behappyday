import { Flame } from "lucide-react";
import { useDayProgress } from "@/hooks/useDayProgress";
import { cn } from "@/lib/utils";

export function DayProgressHeader() {
  const { percent, streak, isComplete } = useDayProgress();
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="flex items-center justify-between px-1 mb-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center text-xs font-semibold",
              isComplete ? "text-success" : "text-primary"
            )}
          >
            {percent}%
          </span>
        </div>
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Сегодня
          </p>
          <p className="text-sm font-medium text-foreground">
            {isComplete ? "День прожит ✨" : "В пути"}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border",
          streak > 0
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-muted border-border text-muted-foreground"
        )}
      >
        <Flame className="w-4 h-4" />
        <span className="text-sm font-semibold tabular-nums">
          {streak}
        </span>
        <span className="text-xs">
          {streak === 1 ? "день" : "дней"}
        </span>
      </div>
    </div>
  );
}
