"use client";

import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/AuthProvider";
import { SectionTabs } from "@/components/SectionTabs";
import { useProgressStore } from "@/lib/progress/store";
import { useMounted } from "@/lib/use-mounted";
import { getSupabase } from "@/lib/supabase/client";
import { localDate } from "@/lib/progress/store";
import { cn } from "@/lib/utils";

export function Header() {
  const mounted = useMounted();
  const session = useSession();
  const stats = useProgressStore((s) => s.stats);
  const streakActiveToday = stats.lastActiveDate === localDate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-thai text-2xl font-semibold text-amber-500">
            อักษร
          </span>
          <span className="text-xl font-bold tracking-tight text-primary">
            Aksorn
          </span>
        </Link>

        <SectionTabs variant="desktop" />

        <div className="flex items-center gap-4">
          {mounted && (
            <>
              <span
                className={cn(
                  "flex items-center gap-1 font-semibold",
                  streakActiveToday ? "text-amber-500" : "text-muted-foreground",
                )}
                title="Day streak"
              >
                <Flame className="h-5 w-5" />
                {stats.currentStreak}
              </span>
              <span
                className="flex items-center gap-1 font-semibold text-indigo-600"
                title="Total XP"
              >
                <Sparkles className="h-5 w-5" />
                {stats.xp}
              </span>
            </>
          )}
          {mounted &&
            (session ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/login" />}
                >
                  Account
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => getSupabase()?.auth.signOut()}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/login" />}
                >
                  Log in
                </Button>
                <Button size="sm" render={<Link href="/login?mode=signup" />}>
                  Sign up
                </Button>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}
