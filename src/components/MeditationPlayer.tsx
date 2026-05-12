import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTodayMeditation } from "@/data/meditations";

export function MeditationPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const todayMeditation = getTodayMeditation();
  const todaySrc = todayMeditation.file;
  const { isPremium } = usePremium();
  const locked = !isPremium && getTodayMeditationIndex() >= FREE_MEDITATIONS_COUNT;

  if (locked) {
    return (
      <div className="relative bg-gradient-to-br from-primary/10 to-accent/15 border border-primary/20 rounded-xl p-5 space-y-3 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/15 blur-xl" />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {todayMeditation.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Сегодняшняя медитация — в Premium
            </p>
          </div>
        </div>
        <PremiumPaywall
          trigger={
            <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              <Sparkles className="w-4 h-4" />
              Открыть все медитации
            </button>
          }
        />
        <p className="text-[11px] text-center text-muted-foreground">
          Бесплатно доступны первые {FREE_MEDITATIONS_COUNT} медитации
        </p>
      </div>
    );
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
      setError(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => setError(false);
    const handleError = () => {
      setIsPlaying(false);
      setError(true);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    audio.pause();
    audio.load();
  }, [todaySrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setError(false);
    } catch {
      setIsPlaying(false);
      setError(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          🎧 Аудио "{todayMeditation.name}" скоро появится
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Загрузи MP3 файлы в чат
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 space-y-3">
      <audio ref={audioRef} src={todaySrc} preload="metadata" />
      
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            "bg-primary text-primary-foreground shadow-md",
            "hover:scale-105 hover:shadow-lg active:scale-95"
          )}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
              {todayMeditation.name}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="p-1 rounded-full hover:bg-primary/10 transition-colors"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {showVolume && (
                <div className="absolute right-0 top-8 bg-card border border-border rounded-lg p-3 shadow-lg z-10 animate-fade-in">
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setVolume(newVolume);
                        if (audioRef.current) {
                          audioRef.current.volume = newVolume;
                        }
                      }}
                      className="w-20 h-1.5 accent-primary cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div 
            className="relative h-2 bg-primary/20 rounded-full overflow-hidden cursor-pointer group"
            onClick={(e) => {
              if (!audioRef.current || duration === 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }}
          >
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all group-hover:bg-primary/80"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "2:30"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
