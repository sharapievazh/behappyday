import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDayPlans } from "@/hooks/useDayPlans";
import { useExercises } from "@/hooks/useExercises";

import { EXERCISES } from "@/data/exercises";
import { ExerciseCard } from "@/components/ExerciseCard";
import { YogaMusicPlayer } from "@/components/YogaMusicPlayer";
import { WaterTracker } from "@/components/WaterTracker";
import { MeditationPlayer } from "@/components/MeditationPlayer";

export function DaySection() {
  const { plans, toggleComplete } = useDayPlans();
  const { data: exercisesData, setReps, toggleDone } = useExercises();

  const planItems = [
    { key: "plan1" as const, text: plans.plan1 },
    { key: "plan2" as const, text: plans.plan2 },
    { key: "plan3" as const, text: plans.plan3 },
  ].filter(item => item.text.trim() !== "");

  

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">День</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">
          План на сегодня
        </h1>
      </div>

      {/* Медитация */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Медитация
        </h2>
        <MeditationPlayer />
      </div>

      {/* Йога-музыка для практики */}
      <YogaMusicPlayer />

      {/* Вода */}
      <WaterTracker />

      {/* План дня */}
      {planItems.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          {planItems.map((item, index) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-4 p-4",
                index !== planItems.length - 1 && "border-b border-border"
              )}
            >
              <Checkbox
                id={item.key}
                checked={plans.completed[item.key]}
                onCheckedChange={() => toggleComplete(item.key)}
                className={cn(
                  "h-6 w-6 rounded-lg border-2 transition-all duration-300",
                  plans.completed[item.key] && "bg-primary border-primary"
                )}
              />
              <label
                htmlFor={item.key}
                className={cn(
                  "flex-1 text-base cursor-pointer transition-all duration-300",
                  plans.completed[item.key] && "text-muted-foreground line-through"
                )}
              >
                {item.text}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-soft">
          <p className="text-foreground font-medium">
            Запусти женское здоровье на весь день 💎
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Пройди утреннюю разминку для тела и души
          </p>
        </div>
      )}

      {/* Фокус дня (если заполнен) */}
      {plans.goal.trim() && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Фокус дня
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-soft">
            <p className="text-foreground">{plans.goal}</p>
          </div>
        </div>
      )}

      {/* Упражнения для женского здоровья */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="w-4 h-4" />
          <h2 className="text-sm font-medium uppercase tracking-wider">
            Женское здоровье
          </h2>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft divide-y divide-border">
          {EXERCISES.map((ex) => {
            const state = exercisesData[ex.id] ?? { reps: ex.defaultReps, done: false };
            return (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                reps={state.reps}
                done={state.done}
                onRepsChange={setReps}
                onToggle={toggleDone}
              />
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center px-4">
          Каждое упражнение — по 1 минуте. Можно увеличить от 1 до 5 минут.
        </p>
      </div>

    </div>
  );
}
