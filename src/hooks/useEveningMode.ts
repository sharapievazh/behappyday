import { useEffect } from "react";

const KEY = "evening-mode-pref"; // "auto" | "on" | "off"

function shouldBeEvening(pref: string | null): boolean {
  if (pref === "on") return true;
  if (pref === "off") return false;
  const h = new Date().getHours();
  return h >= 18 || h < 6;
}

/** Auto-applies .evening-mode class on <html> based on time of day. */
export function useEveningMode() {
  useEffect(() => {
    const apply = () => {
      const pref = localStorage.getItem(KEY);
      const root = document.documentElement;
      if (shouldBeEvening(pref)) root.classList.add("evening-mode");
      else root.classList.remove("evening-mode");
    };
    apply();
    const interval = setInterval(apply, 60_000);
    window.addEventListener("storage", apply);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", apply);
    };
  }, []);
}
