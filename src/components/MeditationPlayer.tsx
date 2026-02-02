import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

// Список медитаций по порядку (каждый день - новая)
// Используем encodeURIComponent для кириллических символов в URL
const MEDITATIONS = [
  { id: 1, name: "Вступление", file: "/audio/meditations/1_Вступление.mp3" },
  { id: 2, name: "Лучшие дары жизни для меня", file: "/audio/meditations/2_лучшие_дары_жизни_для_меня.mp3" },
  { id: 3, name: "Цитата Крайона", file: "/audio/meditations/3_Цитата_Крайона.mp3" },
  { id: 4, name: "Магнитное притяжение", file: "/audio/meditations/4_Магнитное_притяжение.mp3" },
  { id: 5, name: "Будущее рядом", file: "/audio/meditations/5_Будущее_рядом.mp3" },
  { id: 6, name: "Творите вместе с Богом", file: "/audio/meditations/6_Творите_вместе_с_Богом.mp3" },
  { id: 7, name: "Полёт к свободе", file: "/audio/meditations/7_Полёт_к_свободе.mp3" },
  { id: 8, name: "В единстве с Богом и любовью", file: "/audio/meditations/9_В_единстве_с_Богом_и_любовью.mp3" },
  { id: 9, name: "Любовь — движущая сила", file: "/audio/meditations/10_Любовь_движущая_сила.mp3" },
];

function getTodayMeditation() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MEDITATIONS[dayOfYear % MEDITATIONS.length];
}

export function MeditationPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const todayMeditation = getTodayMeditation();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setError(true);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setError(true));
    }
    setIsPlaying(!isPlaying);
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
      <audio ref={audioRef} src={todayMeditation.file} preload="metadata" />
      
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
