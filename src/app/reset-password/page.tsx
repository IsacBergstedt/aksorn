"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useSession } from "@/components/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";
import { useMounted } from "@/lib/use-mounted";

/**
 * Landing page for the password-reset email link. supabase-js exchanges
 * the code in the URL for a session on load; until that finishes there is
 * no session, so we wait rather than declaring the link dead immediately.
 */
export default function ResetPasswordPage() {
  const supabase = getSupabase();
  const session = useSession();
  const mounted = useMounted();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message);
    else router.push("/");
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Choose a new password</CardTitle>
          <CardDescription>
            {session
              ? `Signed in as ${session.user.email}`
              : "Verifying your reset link…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {mounted && !session ? (
            <p className="text-sm text-muted-foreground">
              If this takes more than a moment, the link may have expired —{" "}
              <Link
                href="/login"
                className="text-primary underline-offset-2 hover:underline"
              >
                request a new one
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={busy || !session}>
                {busy ? "Saving…" : "Save new password"}
              </Button>
            </form>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
