import { useState, useEffect } from "react";
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

  const persist = (next: ExercisesData) => {
    setData(next);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: getTodayKey(), data: next })
    );
  };

  const setReps = (id: string, reps: number) => {
    const clamped = Math.max(20, Math.min(50, reps));
    persist({ ...data, [id]: { ...data[id], reps: clamped } });
  };

  const toggleDone = (id: string) => {
    persist({ ...data, [id]: { ...data[id], done: !data[id].done } });
  };

  return { data, setReps, toggleDone };
}
