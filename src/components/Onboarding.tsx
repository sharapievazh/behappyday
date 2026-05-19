import { useEffect, useState } from "react";
import { Sun, Calendar, Moon, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KEY = "bloom-onboarded-v1";

const STEPS = [
  {
    icon: Sparkles,
    title: "Daily Bloom",
    text: "Делаю с любовью к себе — спокойное пространство для женщины, которая хочет проживать день осознанно: утро, день, вечер.",
  },
  {
    icon: Sun,
    title: "Утро",
    text: "Маленькие ритуалы, аффирмация и фокус дня. Запусти день мягко, с собой.",
  },
  {
    icon: Calendar,
    title: "День",
    text: "План на день, упражнения для тела, фраза дня и забота о себе.",
  },
  {
    icon: Moon,
    title: "Вечер",
    text: "Благодарность, рефлексия и закрытие дня. Освободи голову перед сном.",
  },
];

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  const finish = () => {
    localStorage.setItem(KEY, "1");
    setShow(false);
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-8 animate-scale-in">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-4">
          {current.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {current.text}
        </p>
      </div>

      <div className="px-8 pb-12 space-y-6 max-w-md mx-auto w-full">
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-8 bg-primary" : "w-1.5 bg-muted"
              )}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {!last && (
            <Button
              variant="ghost"
              onClick={finish}
              className="flex-1 h-12 rounded-2xl"
            >
              Пропустить
            </Button>
          )}
          <Button
            onClick={() => (last ? finish() : setStep(step + 1))}
            className="flex-1 h-12 rounded-2xl text-base"
          >
            {last ? "Начать" : "Дальше"}
            {!last && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
