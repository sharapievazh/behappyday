import { useState, useEffect, useCallback } from "react";
import { EXERCISES, LYMPH_EXERCISES } from "@/data/exercises";

const ALL_EXERCISES = [...EXERCISES, ...LYMPH_EXERCISES];

interface ExerciseState {
  reps: number;
  done: boolean;
}

type ExercisesData = Record<string, ExerciseState>;

const STORAGE_KEY = "exercises-state";

function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function getDefaults(): ExercisesData {
  return ALL_EXERCISES.reduce<ExercisesData>((acc, ex) => {
    acc[ex.id] = { reps: ex.defaultReps, done: false };
    return acc;
  }, {});
}

export function useExercises() {
  const [data, setData] = useState<ExercisesData>(getDefaults);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayKey()) {
          setData({ ...getDefaults(), ...parsed.data });
        }
      } catch (e) {
        console.error("Failed to parse exercises state");
      }
    }
  }, []);

  const persist = useCallback((next: ExercisesData) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: getTodayKey(), data: next })
    );
    return next;
  }, []);

  const setReps = useCallback(
    (id: string, reps: number) => {
      const clamped = Math.max(1, Math.min(5, reps));
      setData((prev) =>
        persist({ ...prev, [id]: { ...prev[id], reps: clamped } })
      );
    },
    [persist]
  );

  const toggleDone = useCallback(
    (id: string) => {
      setData((prev) =>
        persist({ ...prev, [id]: { ...prev[id], done: !prev[id]?.done } })
      );
    },
    [persist]
  );

  return { data, setReps, toggleDone };
}
