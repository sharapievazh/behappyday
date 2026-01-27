import { useState } from "react";
import { ReflectionQuestion } from "@/components/ReflectionQuestion";
import { Button } from "@/components/ui/button";
import { Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function EveningSection() {
  const [answers, setAnswers] = useState({
    important: "",
    grateful: "",
    learned: "",
  });
  const [dayClosed, setDayClosed] = useState(false);

  const updateAnswer = (key: keyof typeof answers) => (value: string) => {
    setAnswers({ ...answers, [key]: value });
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
            question="За что я благодарна этому дню?"
            value={answers.grateful}
            onChange={updateAnswer("grateful")}
            delay={100}
          />
          <ReflectionQuestion
            question="Что нового я узнала?"
            value={answers.learned}
            onChange={updateAnswer("learned")}
            delay={200}
          />
        </div>
      </div>

      {/* Кнопка закрытия дня */}
      {!dayClosed ? (
        <Button
          onClick={() => setDayClosed(true)}
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
