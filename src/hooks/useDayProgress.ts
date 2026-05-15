import { useEffect, useState, useCallback } from "react";

const todayKey = () => new Date().toISOString().slice(0, 10);

const RITUAL_IDS = ["face", "water", "breathing", "warmup", "reading"];

interface Progress {
  done: number;
  total: number;
  percent: number;
  streak: number;
  isComplete: boolean;
}

function isDayComplete(dateKey: string): boolean {
  const ritualsDone = RITUAL_IDS.every(
    (id) => localStorage.getItem(`ritual-${dateKey}-${id}`) === "1"
  );
  const gratitude = !!localStorage.getItem(`gratitude-${dateKey}`);
  const closed = localStorage.getItem(`day-closed-${dateKey}`) === "1";
  return ritualsDone && gratitude && closed;
}

function computeStreak(): number {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 366; i++) {
    const key = d.toISOString().slice(0, 10);
    if (isDayComplete(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // allow today not yet complete — don't break streak if i===0
      if (i === 0) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

export function useDayProgress(): Progress {
  const compute = useCallback((): Progress => {
    const key = todayKey();
    const ritualsDone = RITUAL_IDS.filter(
      (id) => localStorage.getItem(`ritual-${key}-${id}`) === "1"
    ).length;
    const milestones = [
      ritualsDone === RITUAL_IDS.length,
      !!localStorage.getItem(`emotion-${key}`),
      !!localStorage.getItem(`gratitude-${key}`),
      !!localStorage.getItem(`reflection-${key}`),
      !!localStorage.getItem(`emotion-evening-${key}`),
      (parseInt(localStorage.getItem(`water-${key}`) ?? "0", 10) || 0) >= 8,
      localStorage.getItem(`day-closed-${key}`) === "1",
    ];
    const done = ritualsDone + milestones.slice(1).filter(Boolean).length;
    const total = RITUAL_IDS.length + milestones.length - 1;
    const percent = Math.round((done / total) * 100);
    return {
      done,
      total,
      percent,
      streak: computeStreak(),
      isComplete: milestones.every(Boolean),
    };
  }, []);

  const [progress, setProgress] = useState<Progress>(compute);

  useEffect(() => {
    const refresh = () => setProgress(compute());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("bloom-progress", refresh);
    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("bloom-progress", refresh);
      clearInterval(interval);
    };
  }, [compute]);

  return progress;
}
