import { useState } from "react";
import { Loader2, MailCheck, Sparkles } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { SignInWithApple, type SignInWithAppleResponse } from "@capacitor-community/apple-sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "signup";

const APPLE_CLIENT_ID = "com.behappyday.app";
const OAUTH_REDIRECT_URL = "com.behappyday.app://auth-callback";

function generateNonce(length = 32) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
  if (m.includes("cancel")) return "Вход отменён";
  return message;
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const signInWithApple = async () => {
    setError(null);
    setAppleLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        const rawNonce = generateNonce();
        const hashedNonce = await sha256Hex(rawNonce);
        const result: SignInWithAppleResponse = await SignInWithApple.authorize({
          clientId: APPLE_CLIENT_ID,
          redirectURI: OAUTH_REDIRECT_URL,
          scopes: "email name",
          nonce: hashedNonce,
        });
        const idToken = result.response?.identityToken;
        if (!idToken) throw new Error("Apple не вернул токен");
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: idToken,
          nonce: rawNonce,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "apple",
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : "Не удалось войти через Apple"));
    } finally {
      setAppleLoading(false);
    }
  };

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
          <p className="text-base text-muted-foreground leading-relaxed">
            {mode === "signin"
              ? "С возвращением. Продолжим проживать день с любовью к себе."
              : "Создайте пространство только для себя — мягко и осознанно."}
          </p>
        </div>

        <Button
          type="button"
          disabled={appleLoading}
          onClick={signInWithApple}
          className="w-full h-12 rounded-2xl text-base bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2 mb-6"
        >
          {appleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 384 512" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
          )}
          Войти через Apple
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">или по email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base text-muted-foreground">
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
            <Label htmlFor="password" className="text-base text-muted-foreground">
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
            <div className="text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3">
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
            className="text-base text-primary hover:underline"
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
