import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Minus, Plus, Play, Pause, RotateCcw } from "lucide-react";
import { Exercise } from "@/data/exercises";
import { useEffect, useRef, useState } from "react";

interface ExerciseCardProps {
  exercise: Exercise;
  reps: number;
  done: boolean;
  onRepsChange: (id: string, reps: number) => void;
  onToggle: (id: string) => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function ExerciseCard({
  exercise,
  reps,
  done,
  onRepsChange,
  onToggle,
}: ExerciseCardProps) {
  const totalSeconds = reps * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const doneRef = useRef(done);
  doneRef.current = done;

  const id = exercise.id;
  const handleToggle = useCallback(() => onToggle(id), [onToggle, id]);
  const handleRepsChange = useCallback(
    (next: number) => onRepsChange(id, next),
    [onRepsChange, id]
  );

  useEffect(() => {
    if (!running) setRemaining(reps * 60);
  }, [reps, running]);

  useEffect(() => {
    if (!running) return;
    const timerId = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerId);
          setRunning(false);
          if (!doneRef.current) handleToggle();
          try {
            if ("vibrate" in navigator) navigator.vibrate?.([200, 100, 200]);
          } catch {}
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [running, handleToggle]);

  const handlePlayPause = () => {
    if (remaining === 0) setRemaining(totalSeconds);
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };
  return (
    <div
      className={cn(
        "flex gap-3 p-3 transition-all duration-300",
        done && "opacity-60"
      )}
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 relative">
        <img
          src={exercise.image}
          alt={exercise.title}
          loading="lazy"
          width={768}
          height={768}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform",
            !done && !exercise.image2 && "animate-soft-breathe"
          )}
        />
        {exercise.image2 && (
          <img
            src={exercise.image2}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={768}
            height={768}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              !done && "animate-frame-swap"
            )}
          />
        )}
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
        <div className="flex items-center gap-2 pl-7 flex-wrap">
          <button
            type="button"
            onClick={() => onRepsChange(reps - 1)}
            disabled={reps <= 1 || running}
            className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Уменьшить"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-medium text-foreground tabular-nums min-w-[3.5rem] text-center">
            {reps} мин
          </span>
          <button
            type="button"
            onClick={() => onRepsChange(reps + 1)}
            disabled={reps >= 5 || running}
            className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Увеличить"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 ml-auto">
            <span
              className={cn(
                "text-sm font-semibold tabular-nums min-w-[3rem] text-right",
                running ? "text-primary" : "text-muted-foreground"
              )}
            >
              {formatTime(remaining)}
            </span>
            <button
              type="button"
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label={running ? "Пауза" : "Старт"}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={remaining === totalSeconds && !running}
              className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Сброс"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
