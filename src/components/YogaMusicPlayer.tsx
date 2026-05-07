import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PRESETS = [
  { id: "calm", title: "Спокойный поток" },
  { id: "morning", title: "Утренняя йога" },
  { id: "deep", title: "Глубокое расслабление" },
] as const;

type PresetId = typeof PRESETS[number]["id"];

const CACHE_KEY = "yoga-music-cache-v1";

export function YogaMusicPlayer() {
  const [presetId, setPresetId] = useState<PresetId>("calm");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const preset = PRESETS.find((p) => p.id === presetId)!;

  // Restore cached audio on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}:${presetId}`);
      if (cached) setAudioUrl(cached);
      else setAudioUrl(null);
    } catch {
      // ignore
    }
  }, [presetId]);

  const generateMusic = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-yoga-music", {
        body: { preset: presetId },
      });

      if (error) throw error;

      // data is a Blob (binary audio/mpeg)
      const blob = data instanceof Blob ? data : new Blob([data], { type: "audio/mpeg" });

      // Convert to data URL for caching across sessions (small enough for ~3min mp3)
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAudioUrl(dataUrl);
        try {
          localStorage.setItem(`${CACHE_KEY}:${presetId}`, dataUrl);
        } catch {
          // localStorage may be full — that's ok, audio still works in memory
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (e: any) {
      console.error("Music generation failed:", e);
      const msg = e?.message?.includes("402")
        ? "Закончились кредиты ElevenLabs. Пополни баланс."
        : e?.message?.includes("429")
          ? "Слишком много запросов. Попробуй позже."
          : "Не получилось создать музыку. Попробуй ещё раз.";
      toast({ title: "Ошибка", description: msg, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (e) {
        console.error("Playback error:", e);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 shadow-soft space-y-3">
      <div className="flex items-center gap-2 text-primary">
        <Music className="w-3.5 h-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Йога-музыка для практики
        </span>
      </div>

      {/* Preset selector */}
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPresetId(p.id)}
            className={cn(
              "text-xs px-2 py-2 rounded-lg border transition-all",
              presetId === p.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/60 text-foreground border-border hover:border-primary/40"
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Player or generate button */}
      {audioUrl ? (
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0",
              "bg-primary text-primary-foreground shadow-md",
              "hover:scale-105 hover:shadow-lg active:scale-95"
            )}
            aria-label={isPlaying ? "Пауза" : "Играть"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {preset.title}
            </p>
            <button
              onClick={generateMusic}
              disabled={isLoading}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Генерируем…
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  Создать заново
                </>
              )}
            </button>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            loop
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      ) : (
        <button
          onClick={generateMusic}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
            "bg-primary text-primary-foreground font-medium text-sm shadow-md",
            "hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] transition-all",
            "disabled:opacity-70 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Создаём музыку (около минуты)…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Создать музыку для практики
            </>
          )}
        </button>
      )}

      {!audioUrl && !isLoading && (
        <p className="text-[11px] text-muted-foreground text-center">
          Уникальный нежный трек без авторских прав. Сохранится в приложении.
        </p>
      )}
    </div>
  );
}
