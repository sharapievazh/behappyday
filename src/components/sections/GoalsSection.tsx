import { Target } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MonthlyIntention } from "@/components/MonthlyIntention";
import { WomensLibrary } from "@/components/WomensLibrary";
import { useGoals } from "@/hooks/useGoals";

export function GoalsSection() {
  const { goals, updateGoals } = useGoals();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Target className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Цели</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">
          Постоянные цели
        </h1>
      </div>

      {/* Намерение месяца */}
      <MonthlyIntention />

      {/* Женская библиотека */}
      <WomensLibrary />

      {/* Цель на год */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Цель на год
        </h2>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <Textarea
            placeholder="Моя цель на этот год..."
            value={goals.yearGoal}
            onChange={(e) => updateGoals({ yearGoal: e.target.value })}
            className="min-h-[100px] resize-none rounded-xl border-border bg-background"
          />
        </div>
      </div>

      {/* Premium */}
      <PremiumPaywall
        trigger={
          <button className="w-full text-left rounded-2xl p-5 bg-gradient-to-br from-primary/15 via-primary/10 to-accent/15 border border-primary/30 shadow-soft hover:shadow-card transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg text-foreground">
                    Daily Bloom Premium
                  </h3>
                  {isPremium && (
                    <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                      активен
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isPremium
                    ? "Спасибо! Все материалы открыты."
                    : "Все 140 медитаций, полная библиотека и история"}
                </p>
                {!isPremium && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    от $2.08 / мес
                  </div>
                )}
              </div>
            </div>
          </button>
        }
      />

      {/* Подсказка */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          Эти цели сохраняются и отображаются каждый день
        </p>
      </div>
    </div>
  );
}
