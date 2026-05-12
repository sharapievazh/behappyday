import { Bell, BellOff, Sun, Moon, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useReminders } from "@/hooks/useReminders";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
  const { settings, update, permission, requestPermission, testNotification } = useReminders();

  const supported = typeof window !== "undefined" && "Notification" in window;

  const handleToggle = async (key: "morningEnabled" | "eveningEnabled", value: boolean) => {
    if (value && permission !== "granted") {
      const res = await requestPermission();
      if (res !== "granted") return;
    }
    update({ [key]: value });
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Напоминания
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
        {!supported && (
          <p className="text-xs text-muted-foreground">
            Уведомления не поддерживаются в этом браузере
          </p>
        )}

        {supported && permission === "denied" && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-xl p-3">
            <BellOff className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <span>
              Уведомления заблокированы в браузере. Разреши их в настройках сайта, чтобы получать мягкие напоминания.
            </span>
          </div>
        )}

        {/* Утро */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground">Утреннее</div>
            <div className="text-xs text-muted-foreground">Мягкое начало дня</div>
          </div>
          <input
            type="time"
            value={settings.morningTime}
            onChange={(e) => update({ morningTime: e.target.value })}
            disabled={!settings.morningEnabled}
            className={cn(
              "h-9 px-2 rounded-lg border border-border bg-background text-sm",
              !settings.morningEnabled && "opacity-50"
            )}
          />
          <Switch
            checked={settings.morningEnabled}
            onCheckedChange={(v) => handleToggle("morningEnabled", v)}
          />
        </div>

        {/* Вечер */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground">Вечернее</div>
            <div className="text-xs text-muted-foreground">Тихое закрытие дня</div>
          </div>
          <input
            type="time"
            value={settings.eveningTime}
            onChange={(e) => update({ eveningTime: e.target.value })}
            disabled={!settings.eveningEnabled}
            className={cn(
              "h-9 px-2 rounded-lg border border-border bg-background text-sm",
              !settings.eveningEnabled && "opacity-50"
            )}
          />
          <Switch
            checked={settings.eveningEnabled}
            onCheckedChange={(v) => handleToggle("eveningEnabled", v)}
          />
        </div>

        {/* Повтор */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="flex-1">
            <div className="font-medium text-foreground text-sm">Повторять каждый день</div>
            <div className="text-xs text-muted-foreground">Напоминания будут приходить ежедневно</div>
          </div>
          <Switch
            checked={settings.repeatDaily}
            onCheckedChange={(v) => update({ repeatDaily: v })}
          />
        </div>

        {supported && permission === "granted" && (
          <div className="flex items-center gap-2 pt-1">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground flex-1">Доступ разрешён</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => testNotification("morning")}
              className="text-xs h-8"
            >
              <Bell className="w-3.5 h-3.5 mr-1" />
              Тест
            </Button>
          </div>
        )}

        {supported && permission === "default" && (
          <Button
            onClick={requestPermission}
            className="w-full h-10 rounded-xl"
            variant="outline"
          >
            <Bell className="w-4 h-4 mr-2" />
            Разрешить уведомления
          </Button>
        )}

        <p className="text-[11px] text-muted-foreground text-center">
          Напоминания работают, пока приложение открыто или установлено на главный экран
        </p>
      </div>
    </div>
  );
}
