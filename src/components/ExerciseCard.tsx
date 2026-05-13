import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { Exercise } from "@/data/exercises";

interface ExerciseCardProps {
  exercise: Exercise;
  reps: number;
  done: boolean;
  onRepsChange: (reps: number) => void;
  onToggle: () => void;
}

export function ExerciseCard({
  exercise,
  reps,
  done,
  onRepsChange,
  onToggle,
}: ExerciseCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-3 transition-all duration-300",
        done && "opacity-60"
      )}
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
        <img
          src={exercise.image}
          alt={exercise.title}
          loading="lazy"
          width={768}
          height={768}
          className={cn(
            "w-full h-full object-cover transition-transform",
            !done && "animate-soft-breathe"
          )}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start gap-2">
          <Checkbox
            id={`ex-${exercise.id}`}
            checked={done}
            onCheckedChange={onToggle}
            className={cn(
              "h-5 w-5 mt-0.5 rounded-md border-2 transition-all",
              done && "bg-primary border-primary"
            )}
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={`ex-${exercise.id}`}
              className={cn(
                "block font-medium text-foreground cursor-pointer leading-snug",
                done && "line-through text-muted-foreground"
              )}
            >
              {exercise.title}
            </label>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {exercise.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-7">
          <button
            type="button"
            onClick={() => onRepsChange(reps - 5)}
            disabled={reps <= 20}
            className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Уменьшить"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-medium text-foreground tabular-nums min-w-[3.5rem] text-center">
            {reps} раз
          </span>
          <button
            type="button"
            onClick={() => onRepsChange(reps + 5)}
            disabled={reps >= 50}
            className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Увеличить"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
