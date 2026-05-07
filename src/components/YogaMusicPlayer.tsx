import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const TRACK_URL =
  "https://gkhfifuggxhwdsdecglg.supabase.co/storage/v1/object/public/Audio%20for%20Daily%20Bloom/Music%20for%20meditation_30.mp3";
const TRACK_TITLE = "Спокойный поток";

export function YogaMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => Number.isFinite(audio.duration) && setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setErrorMsg(null);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMsg("Не удалось загрузить аудио");
      console.error("Audio error:", audio.error);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setErrorMsg(null);
    if (isPlaying) {
      audio.pause();
    } else {
      try {
        setIsLoading(true);
        await audio.play();
      } catch (e: any) {
        setIsLoading(false);
        setErrorMsg(e?.message || "Ошибка воспроизведения");
        console.error("Playback error:", e);
      }
    }
  };

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 shadow-soft">
      <div className="flex items-center gap-2 text-primary mb-3">
        <Music className="w-3.5 h-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Музыка для практики
        </span>
      </div>

      <audio ref={audioRef} src={TRACK_URL} preload="metadata" loop />

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
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="flex-1 space-y-1.5 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{TRACK_TITLE}</p>

          <div
            className="relative h-2 bg-primary/20 rounded-full overflow-hidden cursor-pointer group"
            onClick={(e) => {
              if (!audioRef.current || duration === 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const newTime = ((e.clientX - rect.left) / rect.width) * duration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{fmt(currentTime)}</span>
            <span>{duration > 0 ? fmt(duration) : "—"}</span>
          </div>
        </div>
      </div>
      {errorMsg && (
        <p className="text-xs text-destructive mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
