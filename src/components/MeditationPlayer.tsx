import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Список медитаций по порядку (каждый день - новая)
// Используем encodeURIComponent для кириллических символов в URL
const MEDITATIONS = [
  { id: 1, name: "Вступление", file: encodeURI("/audio/meditations/1_Вступление.mp3") },
  { id: 2, name: "Лучшие дары жизни для меня", file: encodeURI("/audio/meditations/2_лучшие_дары_жизни_для_меня.mp3") },
  { id: 3, name: "Цитата Крайона", file: encodeURI("/audio/meditations/3_Цитата_Крайона.mp3") },
  { id: 4, name: "Магнитное притяжение", file: encodeURI("/audio/meditations/4_Магнитное_притяжение.mp3") },
  { id: 5, name: "Будущее рядом", file: encodeURI("/audio/meditations/5_Будущее_рядом.mp3") },
  { id: 6, name: "Творите вместе с Богом", file: encodeURI("/audio/meditations/6_Творите_вместе_с_Богом.mp3") },
  { id: 7, name: "Полёт к свободе", file: encodeURI("/audio/meditations/7_Полёт_к_свободе.mp3") },
  { id: 8, name: "В единстве с Богом и любовью", file: encodeURI("/audio/meditations/9_В_единстве_с_Богом_и_любовью.mp3") },
  { id: 9, name: "Любовь — движущая сила", file: encodeURI("/audio/meditations/10_Любовь_движущая_сила.mp3") },
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
            <span className="text-sm font-medium text-foreground">
              {todayMeditation.name}
            </span>
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="relative h-2 bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
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
