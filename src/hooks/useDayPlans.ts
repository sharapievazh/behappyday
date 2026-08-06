import { useState, useEffect } from "react";
import { getTodayKey } from "@/lib/dayKey";

interface DayPlans {
  plan1: string;
  plan2: string;
  plan3: string;
  goal: string;
  completed: { plan1: boolean; plan2: boolean; plan3: boolean; goal: boolean };
}

const STORAGE_KEY = "day-plans";


export function useDayPlans() {
  const [plans, setPlans] = useState<DayPlans>({
    plan1: "",
    plan2: "",
    plan3: "",
    goal: "",
    completed: { plan1: false, plan2: false, plan3: false, goal: false },
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayKey()) {
          setPlans({
            ...parsed.data,
            completed: {
              plan1: false,
              plan2: false,
              plan3: false,
              goal: false,
              ...(parsed.data?.completed ?? {}),
            },
          });
        }
      } catch (e) {
        console.error("Failed to parse stored plans");
      }
    }
  }, []);

  const updatePlans = (updates: Partial<DayPlans>) => {
    const newPlans = { ...plans, ...updates };
    setPlans(newPlans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayKey(),
      data: newPlans,
    }));
  };

  const toggleComplete = (key: "plan1" | "plan2" | "plan3" | "goal") => {
    const newCompleted = { ...plans.completed, [key]: !plans.completed[key] };
    updatePlans({ completed: newCompleted });
  };

  return { plans, updatePlans, toggleComplete };
}
