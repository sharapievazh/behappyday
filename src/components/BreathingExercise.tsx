import { useState, useEffect, useRef } from "react";
import { Wind, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold" | "exhale";

const PHASES: { key: Phase; label: string; duration: number }[] = [
  { key: "inhale", label: "Вдох", duration: 4 },
  { key: "hold", label: "Задержка", duration: 4 },
  { key: "exhale", label: "Выдох", duration: 6 },
];

const TOTAL_DURATION = 60;

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lastPhaseRef = useRef<Phase | null>(null);

  const currentPhase = PHASES[phaseIdx];

  // Setup / teardown audio
  useEffect(() => {
    if (!isActive || !soundOn) {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
        oscRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      lastPhaseRef.current = null;
      return;
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 220;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    audioCtxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;

    return () => {
      try { osc.stop(); } catch {}
      ctx.close().catch(() => {});
    };
  }, [isActive, soundOn]);

  // Trigger sound envelope on each phase change
  useEffect(() => {
    if (!isActive || !soundOn) return;
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    const osc = oscRef.current;
    if (!ctx || !gain || !osc) return;
    if (lastPhaseRef.current === currentPhase.key) return;
    lastPhaseRef.current = currentPhase.key;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);

    if (currentPhase.key === "inhale") {
      osc.frequency.cancelScheduledValues(now);
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(330, now + currentPhase.duration);
      gain.gain.linearRampToValueAtTime(0.08, now + currentPhase.duration);
    } else if (currentPhase.key === "hold") {
      gain.gain.linearRampToValueAtTime(0.04, now + currentPhase.duration);
    } else {
      osc.frequency.cancelScheduledValues(now);
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.linearRampToValueAtTime(180, now + currentPhase.duration);
      gain.gain.linearRampToValueAtTime(0.0001, now + currentPhase.duration);
    }
  }, [phaseIdx, isActive, soundOn, currentPhase]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 0.1;
        if (next >= TOTAL_DURATION) {
          setIsActive(false);
          return TOTAL_DURATION;
        }
        return next;
      });
      setPhaseTime((t) => {
        const next = t + 0.1;
        if (next >= currentPhase.duration) {
          setPhaseIdx((i) => (i + 1) % PHASES.length);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isActive, currentPhase.duration]);

  const reset = () => {
    setIsActive(false);
    setElapsed(0);
    setPhaseIdx(0);
    setPhaseTime(0);
  };

  const toggle = () => {
    if (elapsed >= TOTAL_DURATION) reset();
    setIsActive((a) => !a);
  };

  const scale =
    currentPhase.key === "inhale"
      ? 0.6 + (phaseTime / currentPhase.duration) * 0.4
      : currentPhase.key === "hold"
      ? 1
      : 1 - (phaseTime / currentPhase.duration) * 0.4;

  const remaining = Math.max(0, Math.ceil(TOTAL_DURATION - elapsed));

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-primary">
          <Wind className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Дыхание · 1 мин
          </span>
        </div>
        <button
          onClick={() => setSoundOn((s) => !s)}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label={soundOn ? "Выключить звук" : "Включить звук"}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Animated circle */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <div
            className="absolute rounded-full bg-primary/20 ease-linear"
            style={{
              width: 96,
              height: 96,
              transform: `scale(${scale})`,
              transition: "transform 100ms linear",
            }}
          />
          <div
            className="absolute rounded-full bg-primary/30 ease-linear"
            style={{
              width: 72,
              height: 72,
              transform: `scale(${scale})`,
              transition: "transform 100ms linear",
            }}
          />
          <span className="relative z-10 text-xs font-medium text-foreground">
            {isActive ? currentPhase.label : "0:" + remaining.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-sm text-foreground">
            {isActive
              ? `${currentPhase.label} · ${remaining}с осталось`
              : "Вдох 4 · Задержка 4 · Выдох 6"}
          </p>
          <button
            onClick={toggle}
            className={cn(
              "w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium",
              "shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            )}
          >
            {isActive ? (
              <><Pause className="w-4 h-4" /> Пауза</>
            ) : (
              <><Play className="w-4 h-4" /> {elapsed > 0 ? "Продолжить" : "Начать"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
