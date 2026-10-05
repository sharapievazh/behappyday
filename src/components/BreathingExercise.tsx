import { useState, useEffect, useRef } from "react";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { playChime, primeChime } from "@/lib/chime";

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

const IDLE_SCALE = 0.95;

function markBreathingComplete() {
  try {
    const dateKey = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`ritual-${dateKey}-breathing`, "1");
    window.dispatchEvent(new Event("bloom-progress"));
  } catch {}
}


export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);

  const rafRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const phaseIdxRef = useRef(0);
  const phaseTimeRef = useRef(0);
  const lastSyncRef = useRef(0);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const currentPhase = PHASES[phaseIdx];

  const scaleFor = (idx: number, t: number) => {
    const phase = PHASES[idx];
    if (phase.key === "inhale") return 0.6 + (t / phase.duration) * 0.4;
    if (phase.key === "hold") return 1;
    return 1 - (t / phase.duration) * 0.4;
  };

  const paintScale = (value: number) => {
    const transform = `scale(${value})`;
    if (outerRef.current) outerRef.current.style.transform = transform;
    if (innerRef.current) innerRef.current.style.transform = transform;
  };

  const paint = (idx: number, t: number) => paintScale(scaleFor(idx, t));

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    let prev = performance.now();
    lastSyncRef.current = elapsedRef.current;

    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;

      elapsedRef.current = Math.min(totalDuration, elapsedRef.current + dt);
      phaseTimeRef.current += dt;

      let phaseChanged = false;
      while (phaseTimeRef.current >= PHASES[phaseIdxRef.current].duration) {
        phaseTimeRef.current -= PHASES[phaseIdxRef.current].duration;
        phaseIdxRef.current = (phaseIdxRef.current + 1) % PHASES.length;
        phaseChanged = true;
      }
      if (phaseChanged) {
        if ("vibrate" in navigator) {
          try { navigator.vibrate(PHASES[phaseIdxRef.current].vibration); } catch {}
        }
        setPhaseIdx(phaseIdxRef.current);
        setPhaseTime(phaseTimeRef.current);
      }

      // Direct style write — no React re-render for the circle animation
      paint(phaseIdxRef.current, phaseTimeRef.current);

      if (elapsedRef.current >= totalDuration) {
        setElapsed(totalDuration);
        setIsActive(false);
        markBreathingComplete();
        playChime();
        if ("vibrate" in navigator) {
          try { navigator.vibrate([200, 100, 200]); } catch {}
        }
        return;
      }

      // Text timer syncs at most once per second
      if (elapsedRef.current - lastSyncRef.current >= 1) {
        lastSyncRef.current = elapsedRef.current;
        setElapsed(elapsedRef.current);
        setPhaseTime(phaseTimeRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isActive, totalDuration]);

  const reset = () => {
    setIsActive(false);
    elapsedRef.current = 0;
    phaseIdxRef.current = 0;
    phaseTimeRef.current = 0;
    lastSyncRef.current = 0;
    setElapsed(0);
    setPhaseIdx(0);
    setPhaseTime(0);
    paintScale(IDLE_SCALE);
  };

  const toggle = () => {
    primeChime();
    if (elapsedRef.current >= totalDuration) reset();
    setIsActive((a) => {
      const next = !a;
      if (next && "vibrate" in navigator) {
        try { navigator.vibrate(PHASES[0].vibration); } catch {}
      }
      return next;
    });
  };

  const started = elapsed > 0 && elapsed < totalDuration;
  const initialScale = isActive || started ? scaleFor(phaseIdx, phaseTime) : IDLE_SCALE;

  const remaining = Math.max(0, Math.ceil(totalDuration - elapsed));
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-5 space-y-4 shadow-soft">
      <div className="flex items-center gap-2 text-primary">
        <Wind className="w-4 h-4" />
        <span className="text-sm font-medium uppercase tracking-wider">
          Дыхательная практика
        </span>
      </div>

      {/* Animated circle — она же кнопка старт/пауза */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isActive ? "Пауза" : "Начать дыхательную практику"}
        className="flex items-center justify-center h-44 w-full relative rounded-2xl active:opacity-90 focus:outline-none"
      >
        <div
          ref={outerRef}
          className="absolute rounded-full bg-primary/20 will-change-transform"
          style={{
            width: 150,
            height: 150,
            transform: `scale(${initialScale})`,
          }}
        />
        <div
          ref={innerRef}
          className="absolute rounded-full bg-primary/30 will-change-transform"
          style={{
            width: 116,
            height: 116,
            transform: `scale(${initialScale})`,
          }}
        />

        <div className="relative z-10 text-center">
          <p className="font-serif text-xl text-foreground">
            {isActive ? currentPhase.label : started ? "Продолжить" : "Готова?"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {min}:{sec.toString().padStart(2, "0")}
          </p>
          <span className="mt-1.5 inline-flex text-primary">
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </span>
        </div>
      </button>

      {/* Duration selector */}
      <div className="flex gap-2 justify-center items-center">
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
        <button
          type="button"
          onClick={reset}
          aria-label="Сбросить"
          className="w-8 h-8 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Метод 4-7-8: вдох 4 · задержка 7 · выдох 8 — мягкая вибрация помогает почувствовать ритм
      </p>
    </div>
  );
}
