import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Languages, Heart, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDayPlans } from "@/hooks/useDayPlans";
import { useExercises } from "@/hooks/useExercises";
import { DAILY_PHRASES, getDayIndex } from "@/data/content";
import { EXERCISES, LYMPH_EXERCISES } from "@/data/exercises";
import { ExerciseCard } from "@/components/ExerciseCard";
import { YogaMusicPlayer } from "@/components/YogaMusicPlayer";

export function DaySection() {
  const { plans, toggleComplete } = useDayPlans();
  const { data: exercisesData, setReps, toggleDone } = useExercises();

  const planItems = [
    { key: "plan1" as const, text: plans.plan1 },
    { key: "plan2" as const, text: plans.plan2 },
    { key: "plan3" as const, text: plans.plan3 },
  ].filter(item => item.text.trim() !== "");

  const phraseIndex = getDayIndex(DAILY_PHRASES.length);

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

      {/* Йога-музыка для практики */}
      <YogaMusicPlayer />

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
          <p className="text-muted-foreground">
            Заполни план в утренней сессии
          </p>
        </div>
      )}

      {/* Цель дня (если заполнена) */}
      {plans.goal.trim() && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Цель дня
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-soft">
            <p className="text-foreground">{plans.goal}</p>
          </div>
        </div>
      )}

      {/* Лимфодренажные упражнения */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Droplets className="w-4 h-4" />
          <h2 className="text-sm font-medium uppercase tracking-wider">
            Лимфодренаж
          </h2>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft divide-y divide-border">
          {LYMPH_EXERCISES.map((ex) => {
            const state = exercisesData[ex.id] ?? { reps: ex.defaultReps, done: false };
            return (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                reps={state.reps}
                done={state.done}
                onRepsChange={(r) => setReps(ex.id, r)}
                onToggle={() => toggleDone(ex.id)}
              />
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center px-4">
          Мягкие движения для разгона лимфы — лучше всего утром натощак
        </p>
      </div>

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
                onRepsChange={(r) => setReps(ex.id, r)}
                onToggle={() => toggleDone(ex.id)}
              />
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center px-4">
          Количество повторений можно менять от 20 до 50
        </p>
      </div>

      {/* Фраза дня — языковая практика */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Languages className="w-4 h-4" />
          <h2 className="text-sm font-medium uppercase tracking-wider">
            Фраза дня
          </h2>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          {[
            { code: "en", label: "English", text: DAILY_PHRASES[phraseIndex].en },
            { code: "ru", label: "Русский", text: DAILY_PHRASES[phraseIndex].ru },
            { code: "kz", label: "Қазақша", text: DAILY_PHRASES[phraseIndex].kz },
          ].map((lang, index) => (
            <div
              key={lang.code}
              className={cn(
                "p-4",
                index !== 2 && "border-b border-border"
              )}
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {lang.label}
              </p>
              <p className="text-foreground">{lang.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
