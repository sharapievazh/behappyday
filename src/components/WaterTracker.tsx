import { useEffect, useState } from "react";
import { Droplet, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const GOAL = 8;
const todayKey = () => `water-${new Date().toISOString().slice(0, 10)}`;

export function WaterTracker() {
  const [glasses, setGlasses] = useState(0);

  useEffect(() => {
    const v = parseInt(localStorage.getItem(todayKey()) ?? "0", 10);
    if (!isNaN(v)) setGlasses(v);
  }, []);

  const set = (n: number) => {
    const v = Math.max(0, Math.min(20, n));
    setGlasses(v);
    localStorage.setItem(todayKey(), String(v));
    window.dispatchEvent(new Event("bloom-progress"));
  };

  const filled = Math.min(glasses, GOAL);
  const extra = Math.max(0, glasses - GOAL);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Вода
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Droplet className="w-4 h-4" />
            <span className="text-sm">
              {glasses} / {GOAL} стаканов
            </span>
          </div>
          {extra > 0 && (
            <span className="text-xs text-success">+{extra} сверх цели</span>
          )}
        </div>

        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: GOAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => set(i + 1 === glasses ? i : i + 1)}
              className={cn(
                "aspect-[3/4] rounded-lg border flex items-end justify-center pb-1 transition-all",
                i < filled
                  ? "bg-primary/20 border-primary"
                  : "bg-background border-border hover:border-primary/40"
              )}
              aria-label={`${i + 1} стакан`}
            >
              <Droplet
                className={cn(
                  "w-4 h-4",
                  i < filled ? "text-primary fill-primary/40" : "text-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => set(glasses - 1)}
            className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary/40 transition-all"
            aria-label="Убрать стакан"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => set(glasses + 1)}
            className="h-10 px-5 rounded-full bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Стакан</span>
          </button>
        </div>
      </div>
    </div>
  );
}
