import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Purchases, type PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { Button } from "@/components/ui/button";
import { ENTITLEMENT_ID } from "@/lib/purchases";

function translateError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("network")) return "Нет соединения с интернетом. Проверьте сеть и попробуйте снова";
  if (m.includes("already") || m.includes("owned"))
    return "Подписка уже оформлена — попробуйте «Восстановить покупки»";
  return "Не удалось оформить подписку. Попробуйте ещё раз";
}

interface PaywallProps {
  onUnlocked: () => void;
}

export function Paywall({ onUnlocked }: PaywallProps) {
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setLoadingOffer(false);
      return;
    }
    Purchases.getOfferings()
      .then(({ current }) => {
        setPkg(current?.monthly ?? current?.availablePackages[0] ?? null);
      })
      .catch(() => setError("Не удалось загрузить предложение подписки"))
      .finally(() => setLoadingOffer(false));
  }, []);

  const subscribe = async () => {
    if (!pkg) return;
    setError(null);
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        onUnlocked();
      }
    } catch (err) {
      const userCancelled = (err as { userCancelled?: boolean } | undefined)?.userCancelled;
      if (!userCancelled) {
        setError(translateError(err instanceof Error ? err.message : ""));
      }
    } finally {
      setPurchasing(false);
    }
  };

  const restore = async () => {
    setError(null);
    setRestoring(true);
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
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
            <Button
              type="button"
              disabled={purchasing || !pkg}
              onClick={subscribe}
              className="w-full h-12 rounded-2xl text-base"
            >
              {purchasing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {pkg
                ? `Оформить подписку — ${pkg.product.priceString}/мес`
                : "Подписка временно недоступна"}
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
