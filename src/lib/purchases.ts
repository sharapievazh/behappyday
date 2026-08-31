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

export async function hasActiveSubscription(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  const { active } = await BeHappyPurchases.getEntitlementStatus();
  return active;
}
