import { RitualStep } from "@/components/RitualStep";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { BreathingExercise } from "@/components/BreathingExercise";
import { EmotionJournal } from "@/components/EmotionJournal";
import { ShareCard } from "@/components/ShareCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Sparkle, Droplet, Wind, Activity, BookOpen } from "lucide-react";
import { QUOTES, getDayIndex } from "@/data/content";
import { useDayPlans } from "@/hooks/useDayPlans";

export function MorningSection() {
  const todayQuote = QUOTES[getDayIndex(QUOTES.length)];
  const { plans, updatePlans } = useDayPlans();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Приветствие */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Доброе утро</span>
        </div>
      </div>

      {/* 2. Аффирмация — карточка для сторис */}
      <ShareCard />
      {/* 3. Утренние ритуалы */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Утренние ритуалы
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <RitualStep id="face" title="Уход лица и массаж" icon={Sparkle} delay={0} />
          <RitualStep id="water" title="Стакан воды и витамины" icon={Droplet} delay={50} />
          <RitualStep id="breathing" title="Дыхательная гимнастика" icon={Wind} delay={100} />
          <RitualStep id="warmup" title="Разминка для тела" icon={Activity} delay={150} />
          <RitualStep id="reading" title="Чтение 10 минут (аудио или книга)" icon={BookOpen} delay={200} />
        </div>
      </div>

      {/* 4. Дыхательная практика */}
      <BreathingExercise />

      {/* 4.1 Дневник эмоций */}
      <EmotionJournal />

      {/* 5. Медитация */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Медитация
        </h2>
        <MeditationPlayer />
      </div>

      {/* 5. Мысль дня — сразу после медитации */}
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

      {/* 6. План дня */}
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

      {/* 7. Цель дня */}
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
    </div>
  );
}
