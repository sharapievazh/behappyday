import { useEffect, useState } from "react";

const KEY = "premium-active";

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsPremium(localStorage.getItem(KEY) === "true");
  }, []);

  const activate = (plan: "monthly" | "yearly") => {
    localStorage.setItem(KEY, "true");
    localStorage.setItem("premium-plan", plan);
    localStorage.setItem("premium-since", new Date().toISOString());
    setIsPremium(true);
  };

  const deactivate = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem("premium-plan");
    localStorage.removeItem("premium-since");
    setIsPremium(false);
  };

  return { isPremium, activate, deactivate };
}

// Free users get only the first N meditations (by daily index)
export const FREE_MEDITATIONS_COUNT = 2;
