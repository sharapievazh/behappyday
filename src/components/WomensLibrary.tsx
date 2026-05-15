import { useEffect, useState } from "react";
import { BookOpen, Film, Library, Search } from "lucide-react";
import { LIBRARY } from "@/data/library";
import { cn } from "@/lib/utils";

const monthKey = () => {
  const d = new Date();
  return `intention-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const FOCUSES = Object.keys(LIBRARY);

export function WomensLibrary() {
  const [focus, setFocus] = useState<string>(FOCUSES[0]);
  const [linkedToIntention, setLinkedToIntention] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(monthKey());
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { focus?: string };
        if (parsed.focus && LIBRARY[parsed.focus]) {
          setFocus(parsed.focus);
          setLinkedToIntention(true);
        }
      } catch {}
    }
  }, []);

  const items = LIBRARY[focus] ?? [];

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Женская библиотека
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Library className="w-4 h-4" />
          <span className="text-sm">
            {linkedToIntention ? "По фокусу месяца" : "Выбери тему"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FOCUSES.map((area) => (
            <button
              key={area}
              onClick={() => {
                setFocus(area);
                setLinkedToIntention(false);
              }}
              className={cn(
                "px-3 h-9 rounded-full text-sm border transition-all",
                focus === area
                  ? "bg-primary/15 border-primary text-foreground"
                  : "bg-background border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              {area}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {items.map((item, i) => {
            const Icon = item.type === "book" ? BookOpen : Film;
            const query = encodeURIComponent(`${item.title} ${item.author}`);
            const url =
              item.type === "book"
                ? `https://www.google.com/search?q=${query}+книга`
                : `https://www.google.com/search?q=${query}+фильм`;
            return (
              <li
                key={`${item.title}-${i}`}
                className="flex gap-3 p-3 rounded-xl bg-background border border-border"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.author}
                  </p>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all"
                  aria-label="Найти"
                >
                  <Search className="w-4 h-4" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
