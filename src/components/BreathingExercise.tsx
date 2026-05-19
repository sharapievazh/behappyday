import { useState, useEffect, useRef } from "react";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold" | "exhale";

const PHASES: { key: Phase; label: string; duration: number; vibration: number | number[] }[] = [
  { key: "inhale", label: "Вдох", duration: 4, vibration: 120 },
  { key: "hold", label: "Задержка", duration: 7, vibration: [60, 80, 60] },
  { key: "exhale", label: "Выдох", duration: 8, vibration: 220 },
];

const DURATIONS = [
  { label: "1 мин", value: 60 },
  { label: "2 мин", value: 120 },
  { label: "3 мин", value: 180 },
];

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const currentPhase = PHASES[phaseIdx];

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 0.1;
        if (next >= totalDuration) {
          setIsActive(false);
          return totalDuration;
        }
        return next;
      });
      setPhaseTime((t) => {
        const next = t + 0.1;
        if (next >= currentPhase.duration) {
          setPhaseIdx((i) => {
            const nextIdx = (i + 1) % PHASES.length;
            if ("vibrate" in navigator) {
              try { navigator.vibrate(PHASES[nextIdx].vibration); } catch {}
            }
            return nextIdx;
          });
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isActive, currentPhase.duration, totalDuration]);

  const reset = () => {
    setIsActive(false);
    setElapsed(0);
    setPhaseIdx(0);
    setPhaseTime(0);
  };

  const toggle = () => {
    if (elapsed >= totalDuration) reset();
    setIsActive((a) => {
      const next = !a;
      if (next && "vibrate" in navigator) {
        try { navigator.vibrate(PHASES[0].vibration); } catch {}
      }
      return next;
    });
  };

  // Scale animation: inhale grows, hold stays, exhale shrinks
  const scale =
    currentPhase.key === "inhale"
      ? 0.6 + (phaseTime / currentPhase.duration) * 0.4
      : currentPhase.key === "hold"
      ? 1
      : 1 - (phaseTime / currentPhase.duration) * 0.4;

  const remaining = Math.max(0, Math.ceil(totalDuration - elapsed));
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 space-y-5 shadow-soft">
      <div className="flex items-center gap-2 text-primary">
        <Wind className="w-4 h-4" />
        <span className="text-sm font-medium uppercase tracking-wider">
          Дыхательная практика
        </span>
      </div>

      {/* Animated circle */}
      <div className="flex items-center justify-center h-56 relative">
        <div
          className="absolute rounded-full bg-primary/20 transition-transform ease-linear"
          style={{
            width: 180,
            height: 180,
            transform: `scale(${scale})`,
            transitionDuration: "100ms",
          }}
        />
        <div
          className="absolute rounded-full bg-primary/30 transition-transform ease-linear"
          style={{
            width: 140,
            height: 140,
            transform: `scale(${scale})`,
            transitionDuration: "100ms",
          }}
        />
        <div className="relative z-10 text-center">
          <p className="font-serif text-2xl text-foreground">
            {isActive ? currentPhase.label : "Готова?"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {min}:{sec.toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Duration selector */}
      <div className="flex gap-2 justify-center">
        {DURATIONS.map((d) => (
          <button
            key={d.value}
            onClick={() => {
              setTotalDuration(d.value);
              reset();
            }}
            disabled={isActive}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-all",
              totalDuration === d.value
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={toggle}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button
          onClick={reset}
          className="w-14 h-14 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Метод 4-7-8: вдох 4 · задержка 7 · выдох 8 — мягкая вибрация помогает почувствовать ритм
      </p>
    </div>
  );
}
