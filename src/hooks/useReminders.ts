import { useEffect, useState, useCallback } from "react";

export interface ReminderSettings {
  morningEnabled: boolean;
  morningTime: string; // "HH:MM"
  eveningEnabled: boolean;
  eveningTime: string;
  repeatDaily: boolean;
}

const KEY = "reminder-settings";

const DEFAULT_SETTINGS: ReminderSettings = {
  morningEnabled: false,
  morningTime: "08:00",
  eveningEnabled: false,
  eveningTime: "21:30",
  repeatDaily: true,
};

const MESSAGES = {
  morning: {
    title: "Доброе утро 🌸",
    body: "Время для утренних ритуалов и аффирмации дня",
  },
  evening: {
    title: "Тихий вечер 🌙",
    body: "Давай мягко закроем день — благодарность и рефлексия",
  },
};

function loadSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function msUntil(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

function showNotification(kind: "morning" | "evening") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const msg = MESSAGES[kind];
  try {
    new Notification(msg.title, {
      body: msg.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `daily-bloom-${kind}`,
      silent: false,
    });
  } catch {
    // ignore
  }
}

export function useReminders() {
  const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );

  const update = useCallback((patch: Partial<ReminderSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied" as NotificationPermission;
    const res = await Notification.requestPermission();
    setPermission(res);
    return res;
  }, []);

  // Schedule timers while app is open
  useEffect(() => {
    if (permission !== "granted") return;
    const timers: number[] = [];

    const schedule = (kind: "morning" | "evening", time: string) => {
      const delay = msUntil(time);
      const t = window.setTimeout(() => {
        showNotification(kind);
        if (settings.repeatDaily) {
          // re-schedule for next day
          const daily = window.setInterval(() => showNotification(kind), 24 * 60 * 60 * 1000);
          timers.push(daily);
        }
      }, delay);
      timers.push(t);
    };

    if (settings.morningEnabled) schedule("morning", settings.morningTime);
    if (settings.eveningEnabled) schedule("evening", settings.eveningTime);

    return () => {
      timers.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
    };
  }, [settings, permission]);

  const testNotification = useCallback((kind: "morning" | "evening") => {
    showNotification(kind);
  }, []);

  return { settings, update, permission, requestPermission, testNotification };
}
