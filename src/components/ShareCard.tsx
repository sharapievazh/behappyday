import { useEffect, useRef, useState } from "react";
import { Share2, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AFFIRMATIONS as affirmations } from "@/data/content";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const dateLabel = () => {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

const getTodayAffirmation = () => {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return affirmations[day % affirmations.length];
};

const getGratitudeFirst = (): string => {
  const raw = localStorage.getItem(`gratitude-${todayKey()}`);
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return (arr.find((s: string) => s && s.trim()) || "").trim();
    if (arr?.items) return (arr.items.find((s: string) => s && s.trim()) || "").trim();
  } catch {}
  return "";
};

export function ShareCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [affirmation, setAffirmation] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAffirmation(getTodayAffirmation());
    setGratitude(getGratitudeFirst());
  }, []);

  const buildCanvas = async (): Promise<HTMLCanvasElement> => {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // background gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#dbeafe");
    g.addColorStop(1, "#bfdbfe");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // soft circle
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.15, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e3a8a";
    ctx.textAlign = "center";

    ctx.font = "500 48px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(dateLabel().toUpperCase(), W / 2, 220);

    ctx.font = "italic 600 84px Georgia, serif";
    ctx.fillStyle = "#0f172a";
    wrapText(ctx, affirmation || "Я выбираю себя.", W / 2, H / 2 - 120, W - 200, 110);

    if (gratitude) {
      ctx.font = "500 44px sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText("Сегодня я благодарна за", W / 2, H / 2 + 200);
      ctx.font = "500 56px sans-serif";
      ctx.fillStyle = "#1e3a8a";
      wrapText(ctx, gratitude, W / 2, H / 2 + 290, W - 240, 76);
    }

    ctx.font = "italic 600 44px Georgia, serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Хочу и делаю с любовью к себе", W / 2, H - 200);

    // Daily Bloom branding
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(W / 2 - 110, H - 120, 14, 0, Math.PI * 2);
    ctx.fill();
    // simple bloom petals
    ctx.fillStyle = "rgba(30,58,138,0.55)";
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      ctx.beginPath();
      ctx.arc(W / 2 - 110 + Math.cos(a) * 18, H - 120 + Math.sin(a) * 18, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = "600 38px sans-serif";
    ctx.fillStyle = "#1e3a8a";
    ctx.textAlign = "left";
    ctx.fillText("Bloom", W / 2 - 80, H - 108);
    ctx.textAlign = "center";

    return canvas;
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    let yy = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, yy);
        line = words[n] + " ";
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, yy);
  };

  const handleShare = async () => {
    const canvas = await buildCanvas();
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "day-card.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Мой день" });
          return;
        } catch {}
      }
      // fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `day-${todayKey()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, "image/png");
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Аффирмация дня
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        <div
          ref={cardRef}
          className="relative aspect-[9/16] max-h-[420px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-primary/15 to-primary/30 p-6 flex flex-col"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">
            {dateLabel()}
          </p>
          <div className="flex-1 flex items-center justify-center px-2">
            <p className="font-serif italic text-xl text-foreground text-center leading-snug">
              «{affirmation}»
            </p>
          </div>
          {gratitude && (
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">Сегодня я благодарна за</p>
              <p className="text-sm text-foreground font-medium line-clamp-2">{gratitude}</p>
            </div>
          )}
          <p className="font-serif italic text-[11px] text-muted-foreground text-center mt-3">
            Хочу и делаю с любовью к себе
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="relative inline-flex w-3.5 h-3.5">
              <span className="absolute inset-0 rounded-full bg-primary/40" />
              <span className="absolute inset-[3px] rounded-full bg-primary" />
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-primary">
              Bloom
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className={cn(
            "w-full h-11 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
            copied
              ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Сохранено
            </>
          ) : (
            <>
              {typeof navigator !== "undefined" && "share" in navigator ? (
                <Share2 className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Поделиться
            </>
          )}
        </button>
      </div>
    </div>
  );
}
