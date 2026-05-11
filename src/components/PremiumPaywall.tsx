import { useState } from "react";
import { Sparkles, Check, Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePremium } from "@/hooks/usePremium";

interface PremiumPaywallProps {
  trigger: React.ReactNode;
  defaultOpen?: boolean;
}

const FEATURES = [
  "Все 140 медитаций — каждый день новая",
  "Полная женская библиотека по фокусам",
  "История эмоций и благодарности за месяц",
  "Карточка дня без водяного знака",
  "Поддерживаешь развитие приложения",
];

export function PremiumPaywall({ trigger, defaultOpen }: PremiumPaywallProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const { isPremium, activate, deactivate } = usePremium();

  const handleActivate = () => {
    activate(plan);
    setTimeout(() => setOpen(false), 600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="font-serif text-2xl text-center">
            Daily Bloom Premium
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Полный доступ ко всем медитациям и материалам
          </p>
        </DialogHeader>

        <ul className="space-y-2 my-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground">{f}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 my-2">
          <button
            onClick={() => setPlan("monthly")}
            className={cn(
              "rounded-xl border-2 p-3 text-left transition-all",
              plan === "monthly"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className="text-xs text-muted-foreground">Месяц</div>
            <div className="font-serif text-lg text-foreground">$2.99</div>
            <div className="text-xs text-muted-foreground">в месяц</div>
          </button>
          <button
            onClick={() => setPlan("yearly")}
            className={cn(
              "rounded-xl border-2 p-3 text-left transition-all relative",
              plan === "yearly"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              -30%
            </span>
            <div className="text-xs text-muted-foreground">Год</div>
            <div className="font-serif text-lg text-foreground">$24.99</div>
            <div className="text-xs text-muted-foreground">~$2.08 / мес</div>
          </button>
        </div>

        {isPremium ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-primary py-2">
              <Sparkles className="w-4 h-4" />
              Premium активен
            </div>
            <Button
              variant="ghost"
              onClick={deactivate}
              className="w-full text-xs text-muted-foreground"
            >
              Отключить (демо)
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleActivate}
            className="w-full h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Начать ({plan === "yearly" ? "$24.99 / год" : "$2.99 / мес"})
          </Button>
        )}

        <p className="text-[11px] text-center text-muted-foreground">
          Демо-режим: оплата подключится позже. Сейчас активация просто открывает доступ.
        </p>
      </DialogContent>
    </Dialog>
  );
}
