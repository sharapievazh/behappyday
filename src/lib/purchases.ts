import { Capacitor } from "@capacitor/core";
import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";

// TODO(Жанна): вставить свой публичный API key из RevenueCat (Project settings → API keys → Apple App Store).
export const REVENUECAT_API_KEY = "YOUR_REVENUECAT_IOS_API_KEY";

// Идентификатор entitlement, который нужно завести в RevenueCat (Entitlements → + New)
// и привязать к подписке. Можно оставить как есть или переименовать — тогда поменяй и здесь.
export const ENTITLEMENT_ID = "premium";

let configured = false;

export async function initPurchases() {
  if (!Capacitor.isNativePlatform() || configured) return;
  configured = true;
  await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
  await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
}

export async function hasActiveSubscription(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  const { customerInfo } = await Purchases.getCustomerInfo();
  return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
}
