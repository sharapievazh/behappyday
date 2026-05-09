import { useEffect, useState } from "react";
import { Compass, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUS_AREAS = [
  "Здоровье и тело",
  "Любовь к себе",
  "Отношения",
  "Финансы",
  "Творчество",
  "Карьера",
  "Спокойствие",
  "Энергия",
];

const monthKey = () => {
  const d = new Date();
  return `intention-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = () => {
  const months = [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
  ];
  const d = new Date();
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

interface Entry {
  focus: string;
  text: string;
  savedAt?: string;
}

const empty: Entry = { focus: "", text: "" };

export function MonthlyIntention() {
  const [entry, setEntry] = useState<Entry>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(monthKey());
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Entry;
        setEntry(parsed);
        if (parsed.savedAt) setSaved(true);
      } catch {}
    }
  }, []);

  const persist = (next: Entry) => {
    localStorage.setItem(monthKey(), JSON.stringify(next));
    setEntry(next);
    setSaved(false);
  };

  const save = () => {
    const next = { ...entry, savedAt: new Date().toISOString() };
    localStorage.setItem(monthKey(), JSON.stringify(next));
    setEntry(next);
    setSaved(true);
  };

  const canSave = entry.focus && entry.text.trim().length > 0;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Намерение месяца
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Compass className="w-4 h-4" />
          <span className="text-sm capitalize">{monthLabel()}</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Фокус месяца</p>
          <div className="flex flex-wrap gap-2">
            {FOCUS_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => persist({ ...entry, focus: area })}
                className={cn(
                  "px-3 h-9 rounded-full text-sm border transition-all",
                  entry.focus === area
                    ? "bg-primary/15 border-primary text-foreground"
                    : "bg-background border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Моё намерение</p>
          <textarea
            value={entry.text}
            onChange={(e) => persist({ ...entry, text: e.target.value })}
            placeholder="В этом месяце я..."
            className={cn(
              "w-full min-h-[90px] p-4 rounded-xl bg-background border border-border resize-none",
              "text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              "placeholder:text-muted-foreground/50"
            )}
          />
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
            "Сохранить намерение"
          )}
        </button>
      </div>
    </div>
  );
}
