import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function snapshotLocalStorage(): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) data[k] = localStorage.getItem(k) ?? "";
  }
  return data;
}

export function restoreToLocalStorage(data: Record<string, string>) {
  Object.entries(data ?? {}).forEach(([k, v]) => {
    if (typeof v === "string") localStorage.setItem(k, v);
  });
}

export function useCloudSync() {
  const { user } = useAuth();
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const save = async () => {
      const snapshot = snapshotLocalStorage();
      await supabase.from("user_data").upsert({
        user_id: user.id,
        data: snapshot,
        updated_at: new Date().toISOString(),
      });
    };

    const init = async () => {
      if (restoredRef.current) return;
      restoredRef.current = true;

      const { data, error } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled || error) return;

      const cloud = (data?.data ?? {}) as Record<string, string>;
      const hasCloud = cloud && Object.keys(cloud).length > 0;
      const isFreshDevice = localStorage.getItem("day-plans") === null;

      if (hasCloud && isFreshDevice) {
        restoreToLocalStorage(cloud);
        window.location.reload();
      }
    };

    init();

    const interval = window.setInterval(save, 30000);

    const onVisibility = () => {
      if (document.hidden) void save();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user]);
}
