import { useState, useEffect } from "react";

interface Goals {
  monthGoal: string;
  yearGoal: string;
}

const STORAGE_KEY = "permanent-goals";

export function useGoals() {
  const [goals, setGoals] = useState<Goals>({
    monthGoal: "",
    yearGoal: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored goals");
      }
    }
  }, []);

  const updateGoals = (updates: Partial<Goals>) => {
    const newGoals = { ...goals, ...updates };
    setGoals(newGoals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
  };

  return { goals, updateGoals };
}
