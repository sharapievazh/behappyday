import { useEffect, useState } from "react";
import { Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOTIONS = [
  { emoji: "😊", label: "Радость" },
  { emoji: "😌", label: "Спокойствие" },
  { emoji: "🥰", label: "Любовь" },
  { emoji: "💪", label: "Сила" },
  { emoji: "😐", label: "Нейтрально" },
  { emoji: "😔", label: "Грусть" },
  { emoji: "😟", label: "Тревога" },
  { emoji: "😡", label: "Злость" },
  { emoji: "😴", label: "Усталость" },
];

const todayKey = (prefix = "emotion") =>
  `${prefix}-${new Date().toISOString().slice(0, 10)}`;

interface Entry {
  emoji: string;
  label: string;
  reason: string;
  savedAt?: string;
}

interface EmotionJournalProps {
  storageKey?: string;
  title?: string;
  prompt?: string;
}

export function EmotionJournal({
  storageKey = "emotion",
  title = "Дневник эмоций",
  prompt = "Как ты себя чувствуешь?",
}: EmotionJournalProps = {}) {
  const [entry, setEntry] = useState<Entry>({ emoji: "", label: "", reason: "" });
  const [saved, setSaved] = useState(false);
  const key = () => todayKey(storageKey);

  useEffect(() => {
    const raw = localStorage.getItem(key());
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Entry;
        setEntry(parsed);
        if (parsed.savedAt) setSaved(true);
      } catch {}
    }
  }, []);

  const select = (emoji: string, label: string) => {
    const next = { ...entry, emoji, label };
    setEntry(next);
    setSaved(false);
    localStorage.setItem(key(), JSON.stringify(next));
  };

  const updateReason = (reason: string) => {
    const next = { ...entry, reason };
    setEntry(next);
    setSaved(false);
    localStorage.setItem(key(), JSON.stringify(next));
  };

  const save = () => {
    const next = { ...entry, savedAt: new Date().toISOString() };
    localStorage.setItem(key(), JSON.stringify(next));
    setEntry(next);
    setSaved(true);
    window.dispatchEvent(new Event("bloom-progress"));
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{prompt}</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {EMOTIONS.map((e) => (
            <button
              key={e.label}
              onClick={() => select(e.emoji, e.label)}
              className={cn(
                "aspect-square rounded-xl text-2xl flex items-center justify-center transition-all",
                "border",
                entry.emoji === e.emoji
                  ? "bg-primary/15 border-primary scale-105"
                  : "bg-background border-border hover:border-primary/40"
              )}
              title={e.label}
            >
              {e.emoji}
            </button>
          ))}
        </div>

        {entry.emoji && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-muted-foreground text-center">
              {entry.label}
            </p>
            <input
              type="text"
              value={entry.reason}
              onChange={(e) => updateReason(e.target.value)}
              placeholder="Краткая причина (по желанию)"
              className={cn(
                "w-full h-11 px-4 rounded-xl bg-background border border-border",
                "text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none",
                "placeholder:text-muted-foreground/50"
              )}
            />
            <button
              onClick={save}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                saved
                  ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
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
        )}
      </div>
    </div>
  );
}
