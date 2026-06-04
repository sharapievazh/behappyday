import { Target } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MonthlyIntention } from "@/components/MonthlyIntention";
import { WomensLibrary } from "@/components/WomensLibrary";
import { NotificationSettings } from "@/components/NotificationSettings";
import { BackupRestore } from "@/components/BackupRestore";
import { useGoals } from "@/hooks/useGoals";

export function GoalsSection() {
  const { goals, updateGoals } = useGoals();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Target className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Фокус</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">
          Мой постоянный фокус
        </h1>
      </div>

      {/* Намерение месяца */}
      <MonthlyIntention />

      {/* Женская библиотека */}
      <WomensLibrary />

      {/* Фокус года */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Фокус года
        </h2>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <Textarea
            placeholder="Мой фокус на этот год..."
            value={goals.yearGoal}
            onChange={(e) => updateGoals({ yearGoal: e.target.value })}
            className="min-h-[100px] resize-none rounded-xl border-border bg-background"
          />
        </div>
      </div>

      {/* Напоминания */}
      <NotificationSettings />

      {/* Резервная копия */}
      <BackupRestore />

      {/* Подсказка */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          Эти цели сохраняются и отображаются каждый день
        </p>
      </div>
    </div>
  );
}
