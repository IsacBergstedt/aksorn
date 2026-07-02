"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
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

export default function LoginPage() {
  const supabase = getSupabase();
  const session = useSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signInWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (otpError) setError(otpError.message);
    else setSent(true);
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {session ? "You're signed in" : "Sign in to Aksorn"}
          </CardTitle>
          <CardDescription>
            {session
              ? session.user.email
              : "Your guest progress on this device moves to your account automatically."}
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
              <Button
                variant="outline"
                onClick={() => supabase.auth.signOut()}
              >
                Sign out
              </Button>
            </div>
          ) : sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <Mail className="h-10 w-10 text-primary" />
              <p className="font-semibold">Check your inbox</p>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to {email}.
              </p>
            </div>
          ) : (
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
              <form onSubmit={signInWithEmail} className="flex flex-col gap-3">
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
                <Button type="submit" disabled={busy}>
                  {busy ? "Sending…" : "Send sign-in link"}
                </Button>
              </form>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
