import { useMemo, useState } from "react";
import { Sparkles, Flame, Heart, Droplets, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RITUAL_IDS = ["face", "water", "breathing", "warmup", "reading"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

type DayStat = {
  key: string;
  day: number;
  percent: number;
  closed: boolean;
  gratitude: boolean;
  water: boolean;
  rituals: number;
  future: boolean;
};

function keyOf(d: Date) {
  return d.toISOString().slice(0, 10);
}

function statFor(d: Date, today: string): DayStat {
  const key = keyOf(d);
  const rituals = RITUAL_IDS.filter(
    (id) => localStorage.getItem(`ritual-${key}-${id}`) === "1"
  ).length;
  const gratitude = !!localStorage.getItem(`gratitude-${key}`);
  const reflection = !!localStorage.getItem(`reflection-${key}`);
  const emotion = !!localStorage.getItem(`emotion-${key}`);
  const eveningEmotion = !!localStorage.getItem(`emotion-evening-${key}`);
  const water = (parseInt(localStorage.getItem(`water-${key}`) ?? "0", 10) || 0) >= 8;
  const closed = localStorage.getItem(`day-closed-${key}`) === "1";

  const extras = [gratitude, reflection, emotion, eveningEmotion, water, closed];
  const done = rituals + extras.filter(Boolean).length;
  const total = RITUAL_IDS.length + extras.length;

  return {
    key,
    day: d.getDate(),
    percent: Math.round((done / total) * 100),
    closed,
    gratitude,
    water,
    rituals,
    future: key > today,
  };
}

export function MyProgress() {
  const [range, setRange] = useState<"month" | "year">("month");
  const today = keyOf(new Date());

  const month = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const m = now.getMonth();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const days: DayStat[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(statFor(new Date(Date.UTC(year, m, i)), today));
    }
    return { label: `${MONTHS[m]} ${year}`, days };
  }, [today]);

  const year = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    return Array.from({ length: 12 }, (_, m) => {
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const stats = Array.from({ length: daysInMonth }, (_, i) =>
        statFor(new Date(Date.UTC(y, m, i + 1)), today)
      );
      const past = stats.filter((s) => !s.future);
      const closed = past.filter((s) => s.closed).length;
      const avg = past.length
        ? Math.round(past.reduce((a, s) => a + s.percent, 0) / past.length)
        : 0;
      return { label: MONTHS[m], short: MONTHS[m].slice(0, 3), closed, avg, hasData: past.length > 0 };
    });
  }, [today]);

  const source = range === "month" ? month.days.filter((d) => !d.future) : [];
  const summary = useMemo(() => {
    const days =
      range === "month"
        ? month.days.filter((d) => !d.future)
        : year.flatMap(() => []);
    if (range === "year") {
      const closed = year.reduce((a, m) => a + m.closed, 0);
      const withData = year.filter((m) => m.hasData);
      const avg = withData.length
        ? Math.round(withData.reduce((a, m) => a + m.avg, 0) / withData.length)
        : 0;
      return { closed, avg, gratitude: 0, water: 0, showDetails: false };
    }
    return {
      closed: days.filter((d) => d.closed).length,
      avg: days.length
        ? Math.round(days.reduce((a, d) => a + d.percent, 0) / days.length)
        : 0,
      gratitude: days.filter((d) => d.gratitude).length,
      water: days.filter((d) => d.water).length,
      showDetails: true,
    };
  }, [range, month, year]);

  const tone = (p: number) => {
    if (p >= 80) return "bg-primary text-primary-foreground";
    if (p >= 50) return "bg-primary/50 text-foreground";
    if (p >= 20) return "bg-primary/25 text-foreground";
    if (p > 0) return "bg-primary/10 text-muted-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {range === "month" ? "Мой месяц" : "Мой год"}
      </h2>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 text-primary" />
            {range === "month" ? month.label : new Date().getFullYear()}
          </div>
          <button
            type="button"
            onClick={() => setRange(range === "month" ? "year" : "month")}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {range === "month" ? "Мой год" : "Мой месяц"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Сетка */}
        {range === "month" ? (
          <div className="grid grid-cols-7 gap-1.5">
            {month.days.map((d) => (
              <div
                key={d.key}
                title={`${d.day} — ${d.percent}%`}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center text-xs transition-colors",
                  d.future ? "bg-muted/40 text-muted-foreground/50" : tone(d.percent),
                  d.key === today && "ring-2 ring-primary ring-offset-1 ring-offset-card"
                )}
              >
                {d.day}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {year.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="w-16 text-xs text-muted-foreground">{m.short}</span>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${m.avg}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {m.avg}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Итоги */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Закрытых дней</span>
            </div>
            <p className="font-serif text-2xl text-foreground">{summary.closed}</p>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">В среднем</span>
            </div>
            <p className="font-serif text-2xl text-foreground">{summary.avg}%</p>
          </div>
          {summary.showDetails && (
            <>
              <div className="rounded-xl bg-secondary/60 p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Благодарность</span>
                </div>
                <p className="font-serif text-2xl text-foreground">{summary.gratitude}</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Вода</span>
                </div>
                <p className="font-serif text-2xl text-foreground">{summary.water}</p>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {source.length === 0 && range === "month"
            ? "Здесь появится ваш прогресс — просто проживайте день"
            : "Чем насыщеннее день, тем ярче клетка. Без оценок — только ваша забота о себе."}
        </p>
      </div>
    </div>
  );
}
