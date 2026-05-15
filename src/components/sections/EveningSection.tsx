import { useEffect, useState } from "react";
import { ReflectionQuestion } from "@/components/ReflectionQuestion";
import { GratitudeJournal } from "@/components/GratitudeJournal";

import { Button } from "@/components/ui/button";
import { Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const todayKey = () => new Date().toISOString().slice(0, 10);
const reflectionKey = () => `reflection-${todayKey()}`;
const dayClosedKey = () => `day-closed-${todayKey()}`;

export function EveningSection() {
  const [answers, setAnswers] = useState({ important: "", learned: "" });
  const [dayClosed, setDayClosed] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(reflectionKey());
    if (raw) {
      try { setAnswers(JSON.parse(raw)); } catch {}
    }
    if (localStorage.getItem(dayClosedKey()) === "1") setDayClosed(true);
  }, []);

  const updateAnswer = (key: keyof typeof answers) => (value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    localStorage.setItem(reflectionKey(), JSON.stringify(next));
  };

  const closeDay = () => {
    setDayClosed(true);
    localStorage.setItem(dayClosedKey(), "1");
    window.dispatchEvent(new Event("bloom-progress"));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Moon className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Вечер</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">
          Закрытие дня
        </h1>
      </div>



      {/* Рефлексия */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Рефлексия
        </h2>
        
        <div className="bg-card border border-border rounded-2xl p-5 space-y-5 shadow-soft">
          <ReflectionQuestion
            question="Что важного было сегодня?"
            value={answers.important}
            onChange={updateAnswer("important")}
            delay={0}
          />
          <ReflectionQuestion
            question="Что нового я узнала?"
            value={answers.learned}
            onChange={updateAnswer("learned")}
            delay={100}
          />
        </div>
      </div>

      {/* Дневник благодарности */}
      <GratitudeJournal />

      {/* Кнопка закрытия дня */}
      {!dayClosed ? (
        <Button
          onClick={closeDay}
          size="lg"
          className={cn(
            "w-full h-14 text-lg font-medium rounded-2xl",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "shadow-soft transition-all duration-300 hover:shadow-card"
          )}
        >
          День закрыт
        </Button>
      ) : (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <p className="font-serif text-xl text-foreground">
            День прожит. Я была с собой честна.
          </p>
        </div>
      )}
    </div>
  );
}
