import { useState } from "react";
import { Music, Play, Pause, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  // YouTube video ID for embedded playback (autoplay-friendly)
  youtubeId: string;
}

const TRACKS: Track[] = [
  {
    id: "calm",
    title: "Yoga Flow — спокойная медитация",
    youtubeId: "inpok4MKVLM", // 5-min calm meditation music
  },
  {
    id: "morning",
    title: "Утренняя йога — мягкий поток",
    youtubeId: "2OEL4P1Rz04",
  },
  {
    id: "deep",
    title: "Глубокое расслабление — 432 Hz",
    youtubeId: "1ZYbU82GVz4",
  },
];

export function YogaMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [showList, setShowList] = useState(false);

  const track = TRACKS[trackIndex];
  const embedSrc = `https://www.youtube.com/embed/${track.youtubeId}?autoplay=${
    isPlaying ? 1 : 0
  }&loop=1&playlist=${track.youtubeId}&controls=0&modestbranding=1&rel=0`;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 shadow-soft space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying((p) => !p)}
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
          <div className="flex items-center gap-2 text-primary mb-0.5">
            <Music className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Йога-музыка
            </span>
          </div>
          <button
            onClick={() => setShowList((s) => !s)}
            className="flex items-center gap-1 text-sm font-medium text-foreground truncate w-full text-left"
          >
            <span className="truncate">{track.title}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
                showList && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {showList && (
        <div className="bg-card/60 border border-border rounded-xl overflow-hidden animate-fade-in">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setTrackIndex(i);
                setIsPlaying(true);
                setShowList(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 text-sm transition-colors",
                i !== TRACKS.length - 1 && "border-b border-border",
                i === trackIndex
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/50"
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      {/* Hidden YouTube iframe handles audio playback */}
      <div className="h-0 overflow-hidden">
        <iframe
          key={`${track.id}-${isPlaying}`}
          src={embedSrc}
          title={track.title}
          allow="autoplay; encrypted-media"
          className="w-full h-0"
        />
      </div>
    </div>
  );
}
