"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/components/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

const COPY: Record<Mode, { title: string; description: string }> = {
  login: {
    title: "Log in to Aksorn",
    description: "Welcome back — pick up where you left off.",
  },
  signup: {
    title: "Create your account",
    description:
      "Save your progress across devices. New accounts start fresh — guest progress on this device won't carry over.",
  },
  forgot: {
    title: "Reset your password",
    description: "Enter your email and we'll send you a reset link.",
  },
};

function LoginCard() {
  const supabase = getSupabase();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  // ?code= is only present when Google sends the user back here (PKCE);
  // captured once because supabase-js strips it from the URL after the
  // exchange. Guards the redirect below so plain visits to /login — logged
  // in or out — never get bounced.
  const [oauthReturn] = useState(() => searchParams.has("code"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState<"confirm" | "reset" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (oauthReturn && session) router.replace("/reading");
  }, [oauthReturn, session, router]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSent(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError(null);
    if (mode === "forgot") {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) setError(err.message);
      else setSent("reset");
    } else if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
      });
      if (err) setError(err.message);
      // Session is null only when email confirmation is enabled in the
      // Supabase dashboard; otherwise we're signed in — head into the app.
      else if (!data.session) setSent("confirm");
      else router.replace("/reading");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) setError(err.message);
      else router.replace("/reading");
    }
    setBusy(false);
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {session ? "Your account" : COPY[mode].title}
        </CardTitle>
        <CardDescription>
          {session ? session.user.email : COPY[mode].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!supabase ? (
          <p className="text-sm text-muted-foreground">
            Accounts aren&rsquo;t configured yet — set{" "}
            <code className="rounded bg-secondary px-1">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-secondary px-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            in <code className="rounded bg-secondary px-1">.env.local</code>.
            Until then, progress is saved on this device.
          </p>
        ) : session ? (
          <div className="flex flex-col gap-3">
            <Button render={<Link href="/" />}>Back to lessons</Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          </div>
        ) : sent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Mail className="h-10 w-10 text-primary" />
            <p className="font-semibold">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
              {sent === "reset"
                ? `We sent a password reset link to ${email}.`
                : `We sent a confirmation link to ${email}.`}
            </p>
          </div>
        ) : (
          <>
            {mode !== "forgot" && (
              <>
                <Button variant="outline" onClick={signInWithGoogle}>
                  Continue with Google
                </Button>
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs uppercase text-muted-foreground">
                    or
                  </span>
                  <Separator className="flex-1" />
                </div>
              </>
            )}
            <form onSubmit={submit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {mode !== "forgot" && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        className="text-xs text-primary underline-offset-2 hover:underline"
                        onClick={() => switchMode("forgot")}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" disabled={busy}>
                {busy
                  ? "Working…"
                  : mode === "login"
                    ? "Log in"
                    : mode === "signup"
                      ? "Sign up"
                      : "Send reset link"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  New to Aksorn?{" "}
                  <button
                    type="button"
                    className="text-primary underline-offset-2 hover:underline"
                    onClick={() => switchMode("signup")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary underline-offset-2 hover:underline"
                    onClick={() => switchMode("login")}
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-8">
      {/* useSearchParams requires a Suspense boundary at prerender time. */}
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </main>
  );
}
