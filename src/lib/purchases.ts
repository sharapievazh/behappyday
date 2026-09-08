import { Capacitor, registerPlugin } from "@capacitor/core";

export interface StoreProduct {
  id: string;
  displayName: string;
  displayPrice: string;
  price: number;
  period: "day" | "week" | "month" | "year" | "";
}

interface BeHappyPurchasesPlugin {
  getOfferings(): Promise<{ products: StoreProduct[] }>;
  purchase(options: { productId: string }): Promise<{
    active: boolean;
    cancelled?: boolean;
    pending?: boolean;
  }>;
  restorePurchases(): Promise<{ active: boolean }>;
  getEntitlementStatus(): Promise<{ active: boolean }>;
}

export const BeHappyPurchases = registerPlugin<BeHappyPurchasesPlugin>("BeHappyPurchases");

export const MONTHLY_PRODUCT_ID = "com.behappyday.app.monthly";
export const ANNUAL_PRODUCT_ID = "com.behappyday.app.annual";

// StoreKit-запросы не должны иметь возможность держать экран загрузки бесконечно —
// если Apple/сеть не отвечают вовремя, приложение должно всё равно открыться
// (показав экран подписки), а не зависнуть на спиннере.
const STOREKIT_TIMEOUT_MS = 6000;

export function withTimeout<T>(promise: Promise<T>, ms = STOREKIT_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("StoreKit request timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export async function hasActiveSubscription(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  try {
    const { active } = await withTimeout(BeHappyPurchases.getEntitlementStatus());
    return active;
  } catch {
    // Не удалось получить статус вовремя — не блокируем запуск приложения,
    // просто считаем, что подписки нет, и показываем экран оплаты.
    return false;
  }
}
