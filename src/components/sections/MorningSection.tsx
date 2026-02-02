import { RitualStep } from "@/components/RitualStep";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { AFFIRMATIONS, QUOTES, getDayIndex } from "@/data/content";
import { useDayPlans } from "@/hooks/useDayPlans";

export function MorningSection() {
  const dayIndex = getDayIndex();
  const todayAffirmation = AFFIRMATIONS[dayIndex];
  const todayQuote = QUOTES[dayIndex];
  const { plans, updatePlans } = useDayPlans();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Приветствие */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Доброе утро</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">
          Я могу и делаю с любовью.
        </h1>
      </div>

      {/* 2. Аффирмация дня */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Аффирмация дня
        </h2>
        <div className="bg-card border border-border rounded-2xl p-5 text-center shadow-soft">
          <p className="font-serif text-lg text-foreground leading-relaxed">
            {todayAffirmation}
          </p>
        </div>
      </div>

      {/* 3. Утренние ритуалы */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Утренние ритуалы
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <RitualStep
            id="face"
            title="Уход лица и массаж"
            delay={0}
          />
          <RitualStep
            id="water"
            title="Стакан воды и витамины"
            delay={50}
          />
          <RitualStep
            id="breathing"
            title="Дыхательная гимнастика"
            delay={100}
          />
          <RitualStep
            id="warmup"
            title="Разминка для тела"
            delay={150}
          />
          <RitualStep
            id="reading"
            title="Чтение 10 минут (аудио или книга)"
            delay={200}
          />
        </div>
      </div>

      {/* 4. Медитация */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Медитация
        </h2>
        <MeditationPlayer />
      </div>

      {/* 5. План дня */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          План дня
        </h2>
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-soft">
          <Input
            placeholder="План 1"
            value={plans.plan1}
            onChange={(e) => updatePlans({ plan1: e.target.value })}
            className="h-11 rounded-xl border-border bg-background"
          />
          <Input
            placeholder="План 2"
            value={plans.plan2}
            onChange={(e) => updatePlans({ plan2: e.target.value })}
            className="h-11 rounded-xl border-border bg-background"
          />
          <Input
            placeholder="План 3"
            value={plans.plan3}
            onChange={(e) => updatePlans({ plan3: e.target.value })}
            className="h-11 rounded-xl border-border bg-background"
          />
        </div>
      </div>

      {/* 6. Цель дня */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Цель дня
        </h2>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <Textarea
            placeholder="Моя цель на сегодня"
            value={plans.goal}
            onChange={(e) => updatePlans({ goal: e.target.value })}
            className="min-h-[60px] resize-none rounded-xl border-border bg-background"
          />
        </div>
      </div>

      {/* 7. Мысль наставника */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Мысль дня
        </h2>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-soft">
          <p className="font-serif text-base text-foreground leading-relaxed mb-2">
            «{todayQuote.text}»
          </p>
          <p className="text-sm text-muted-foreground text-right">
            — {todayQuote.author}
          </p>
        </div>
      </div>
    </div>
  );
}
