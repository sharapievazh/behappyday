import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import {
  BeHappyPurchases,
  MONTHLY_PRODUCT_ID,
  ANNUAL_PRODUCT_ID,
  withTimeout,
  type StoreProduct,
} from "@/lib/purchases";

interface PaywallProps {
  onUnlocked: () => void;
}

export function Paywall({ onUnlocked }: PaywallProps) {
  const [monthly, setMonthly] = useState<StoreProduct | null>(null);
  const [annual, setAnnual] = useState<StoreProduct | null>(null);
  const [selected, setSelected] = useState<"monthly" | "annual">("annual");
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setLoadingOffer(false);
      return;
    }
    withTimeout(BeHappyPurchases.getOfferings())
      .then(({ products }) => {
        const m = products.find((p) => p.id === MONTHLY_PRODUCT_ID) ?? null;
        const a = products.find((p) => p.id === ANNUAL_PRODUCT_ID) ?? null;
        setMonthly(m);
        setAnnual(a);
        if (!a && m) setSelected("monthly");
      })
      .catch(() => setError("Не удалось загрузить предложение подписки"))
      .finally(() => setLoadingOffer(false));
  }, []);

  const savingsPercent =
    monthly && annual ? Math.round((1 - annual.price / 12 / monthly.price) * 100) : null;

  const chosen = selected === "annual" ? annual ?? monthly : monthly ?? annual;

  const subscribe = async () => {
    if (!chosen) return;
    setError(null);
    setPurchasing(true);
    try {
      const { active, pending } = await BeHappyPurchases.purchase({ productId: chosen.id });
      if (active) {
        onUnlocked();
      } else if (pending) {
        setError("Покупка ожидает подтверждения (например, от родителя) — доступ откроется автоматически");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось оформить подписку. Попробуйте ещё раз");
    } finally {
      setPurchasing(false);
    }
  };

  const restore = async () => {
    setError(null);
    setRestoring(true);
    try {
      const { active } = await BeHappyPurchases.restorePurchases();
      if (active) {
        onUnlocked();
      } else {
        setError("Активная подписка не найдена для этого Apple ID");
      }
    } catch {
      setError("Не удалось восстановить покупки. Попробуйте позже");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 max-w-md mx-auto w-full text-center">
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-3">BeHappyDay</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          Ежедневные ритуалы, медитации и дневник благодарности — доступ по подписке.
        </p>

        {loadingOffer ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
        ) : (
          <>
            {(monthly || annual) && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {annual && (
                  <button
                    type="button"
                    onClick={() => setSelected("annual")}
                    className={`relative rounded-2xl border-2 p-4 text-left transition-colors ${
                      selected === "annual" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    {savingsPercent !== null && savingsPercent > 0 && (
                      <span className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[11px] font-medium px-2 py-0.5 rounded-full">
                        −{savingsPercent}%
                      </span>
                    )}
                    <div className="text-sm text-muted-foreground mb-1">Год</div>
                    <div className="text-lg font-medium text-foreground">{annual.displayPrice}</div>
                  </button>
                )}
                {monthly && (
                  <button
                    type="button"
                    onClick={() => setSelected("monthly")}
                    className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                      selected === "monthly" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Месяц</div>
                    <div className="text-lg font-medium text-foreground">{monthly.displayPrice}</div>
                  </button>
                )}
              </div>
            )}

            <Button
              type="button"
              disabled={purchasing || !chosen}
              onClick={subscribe}
              className="w-full h-12 rounded-2xl text-base"
            >
              {purchasing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {chosen ? "Оформить подписку" : "Подписка временно недоступна"}
            </Button>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 mt-4">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={restoring}
              onClick={restore}
              className="text-sm text-primary hover:underline mt-6 disabled:opacity-50"
            >
              {restoring ? "Восстанавливаем…" : "Восстановить покупки"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
