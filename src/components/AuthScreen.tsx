import { useState } from "react";
import { Sparkles, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "signup";

function translateError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Неверный email или пароль";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Этот email уже зарегистрирован";
  if (m.includes("password should be at least"))
    return "Пароль должен содержать минимум 6 символов";
  if (m.includes("weak") || m.includes("pwned"))
    return "Придумайте другой пароль — этот слишком простой";
  if (m.includes("email not confirmed"))
    return "Подтвердите email — письмо уже отправлено на вашу почту";

  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Проверьте, правильно ли указан email";
  if (m.includes("rate limit")) return "Слишком много попыток. Попробуйте немного позже";
  return message;
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) setCheckEmail(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : "Что-то пошло не так"));
    } finally {
      setLoading(false);
    }
  };

  if (checkEmail) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-8 animate-scale-in">
          <MailCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-4">Проверьте почту</h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
          Мы отправили письмо на {email}. Перейдите по ссылке из письма, чтобы подтвердить
          адрес и войти.
        </p>
        <Button
          variant="ghost"
          className="mt-8 h-12 rounded-2xl"
          onClick={() => {
            setCheckEmail(false);
            setMode("signin");
          }}
        >
          Вернуться к входу
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-3">BeHappyDay</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mode === "signin"
              ? "С возвращением. Продолжим проживать день с любовью к себе."
              : "Создайте пространство только для себя — мягко и осознанно."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 rounded-xl bg-card border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className="h-12 rounded-xl bg-card border-border"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl text-base">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "signin" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
          >
            {mode === "signin"
              ? "Нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
