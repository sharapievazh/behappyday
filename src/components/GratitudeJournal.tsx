import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const todayKey = () => `gratitude-${new Date().toISOString().slice(0, 10)}`;

interface Entry {
  items: [string, string, string];
  savedAt?: string;
}

const empty: Entry = { items: ["", "", ""] };

export function GratitudeJournal() {
  const [entry, setEntry] = useState<Entry>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(todayKey());
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Entry;
        setEntry(parsed);
        if (parsed.savedAt) setSaved(true);
      } catch {}
    }
  }, []);

  const update = (i: number, value: string) => {
    const items = [...entry.items] as Entry["items"];
    items[i] = value;
    const next = { ...entry, items };
    setEntry(next);
    setSaved(false);
    localStorage.setItem(todayKey(), JSON.stringify(next));
  };

  const save = () => {
    const next = { ...entry, savedAt: new Date().toISOString() };
    localStorage.setItem(todayKey(), JSON.stringify(next));
    setEntry(next);
    setSaved(true);
  };

  const canSave = entry.items.some((s) => s.trim().length > 0);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Дневник благодарности
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Три «спасибо» этому дню</span>
        </div>

        <div className="space-y-3">
          {entry.items.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-16 shrink-0">
                Спасибо за
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => update(i, e.target.value)}
                placeholder="..."
                className={cn(
                  "flex-1 h-11 px-4 rounded-xl bg-background border border-border",
                  "text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none",
                  "placeholder:text-muted-foreground/50"
                )}
              />
            </div>
          ))}
        </div>

        <button
          onClick={save}
          disabled={!canSave}
          className={cn(
            "w-full h-11 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
            saved
              ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            !canSave && "opacity-50 cursor-not-allowed"
          )}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Сохранено
            </>
          ) : (
            "Сохранить"
          )}
        </button>
      </div>
    </div>
  );
}
