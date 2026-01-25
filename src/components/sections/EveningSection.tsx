import { useState } from "react";
import { MentorMessage } from "@/components/MentorMessage";
import { ReflectionQuestion } from "@/components/ReflectionQuestion";
import { DayClosedButton } from "@/components/DayClosedButton";
import { Moon } from "lucide-react";

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
          <span className="text-sm font-medium uppercase tracking-wider">Добрый вечер</span>
        </div>
        <h1 className="font-serif text-3xl text-foreground">
          Закрытие дня
        </h1>
      </div>

      <MentorMessage message="Ты была с собой честна. Этого достаточно." />

      {/* Reflection */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Рефлексия
        </h2>
        
        <div className="bg-card border border-border rounded-2xl p-5 space-y-5 shadow-soft">
          <ReflectionQuestion
            question="Что важного было сегодня?"
            value={answers.important}
            onChange={updateAnswer("important")}
            delay={100}
          />
          <ReflectionQuestion
            question="За что благодарна?"
            value={answers.grateful}
            onChange={updateAnswer("grateful")}
            delay={200}
          />
          <ReflectionQuestion
            question="Что нового узнала?"
            value={answers.learned}
            onChange={updateAnswer("learned")}
            delay={300}
          />
        </div>
      </div>

      {/* Close day */}
      {!dayClosed && (
        <div className="pt-4">
          <DayClosedButton onClose={() => setDayClosed(true)} />
        </div>
      )}

      {dayClosed && (
        <MentorMessage 
          message="Молодец! День прожит с любовью к себе." 
          className="bg-success/10 border-success/30"
        />
      )}
    </div>
  );
}
