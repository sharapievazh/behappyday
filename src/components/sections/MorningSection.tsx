import { MentorMessage } from "@/components/MentorMessage";
import { RitualStep } from "@/components/RitualStep";
import { Affirmation } from "@/components/Affirmation";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { Sparkles, BookOpen } from "lucide-react";

const AFFIRMATIONS = [
  "Я выбираю движение вперёд, даже если мне страшно.",
  "Я достойна всего хорошего, что приходит в мою жизнь.",
  "Я делаю маленькие шаги к большим переменам.",
  "Я принимаю себя полностью — сегодня и всегда.",
];

const ENGLISH_PHRASES = [
  { phrase: "I'm making progress every day", translation: "Я прогрессирую каждый день" },
  { phrase: "Small steps lead to big results", translation: "Маленькие шаги ведут к большим результатам" },
  { phrase: "I choose growth over comfort", translation: "Я выбираю рост вместо комфорта" },
];

export function MorningSection() {
  const todayAffirmation = AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length];
  const todayPhrase = ENGLISH_PHRASES[new Date().getDay() % ENGLISH_PHRASES.length];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Доброе утро</span>
        </div>
        <h1 className="font-serif text-3xl text-foreground">
          Начни день с любовью
        </h1>
      </div>

      <MentorMessage message="Сегодня день для тебя. Всё маленькое, но важное." />

      {/* Affirmation */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Аффирмация дня
        </h2>
        <Affirmation text={todayAffirmation} />
        <MentorMessage message="Почувствуй эту силу внутри." />
      </div>

      {/* Mini rituals */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Утренние ритуалы
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <RitualStep
            id="water"
            title="Стакан воды"
            description="Начни день с чистоты"
            delay={100}
          />
          <RitualStep
            id="clean"
            title="Утренняя гигиена"
            description="Забота о себе"
            delay={200}
          />
          <RitualStep
            id="sport"
            title="5-7 минут спорта"
            description="Разбуди тело по 10 раз (поклоны солнцу, приседания, выпады, отжимания, пресс)"
            delay={300}
          />
        </div>
        <MentorMessage message="Делай спокойно, но полностью. Всё это для тебя." />
      </div>

      {/* Meditation */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          2-3 минуты медитации
        </h2>
        <MeditationPlayer />
        <MentorMessage message="Успокой ум. Дыши глубоко." />
      </div>

      {/* English */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Английский
        </h2>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <p className="font-serif text-lg text-foreground mb-2">
            "{todayPhrase.phrase}"
          </p>
          <p className="text-sm text-muted-foreground">
            {todayPhrase.translation}
          </p>
        </div>
        <MentorMessage message="Повтори вслух и почувствуй прогресс." />
      </div>
    </div>
  );
}
