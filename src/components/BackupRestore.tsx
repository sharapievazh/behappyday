import { useRef, useState } from "react";
import { Download, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackupRestore() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const exportData = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) data[k] = localStorage.getItem(k) ?? "";
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bloom-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Резервная копия сохранена");
    setTimeout(() => setMsg(null), 2500);
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Record<string, string>;
      Object.entries(data).forEach(([k, v]) => {
        if (typeof v === "string") localStorage.setItem(k, v);
      });
      setMsg("Данные восстановлены. Перезагрузка...");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setMsg("Не удалось прочитать файл");
      setTimeout(() => setMsg(null), 2500);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Резервная копия
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-soft">
        <p className="text-xs text-muted-foreground">
          Сохрани данные перед сменой телефона или браузера
        </p>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all"
          >
            <Download className="w-4 h-4" /> Экспорт
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 h-11 rounded-xl bg-background border border-border flex items-center justify-center gap-2 text-sm font-medium hover:border-primary/40 transition-all"
          >
            <Upload className="w-4 h-4" /> Импорт
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = "";
            }}
          />
        </div>
        {msg && (
          <p
            className={cn(
              "text-xs flex items-center gap-1.5 animate-fade-in",
              "text-success"
            )}
          >
            <Check className="w-3.5 h-3.5" /> {msg}
          </p>
        )}
      </div>
    </div>
  );
}
