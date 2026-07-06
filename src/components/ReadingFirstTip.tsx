"use client";

import Link from "next/link";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiSettings } from "@/lib/ui-settings";
import { useMounted } from "@/lib/use-mounted";

/**
 * Dismissible advisory at the top of /phrases: the course is open to
 * everyone, but reading the script first is the recommended path. Advice
 * only — nothing is gated on it. Dismissal persists via useUiSettings.
 */
export function ReadingFirstTip() {
  const mounted = useMounted();
  const dismissed = useUiSettings((s) => s.readingTipDismissed);
  const dismiss = useUiSettings((s) => s.dismissReadingTip);

  if (!mounted || dismissed) return null;

  return (
    <div className="mb-8 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">New to Thai script?</p>
        <p className="mt-0.5 text-muted-foreground">
          Everything here is written in Thai. We recommend the{" "}
          <Link
            href="/reading"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Reading Thai
          </Link>{" "}
          course first, so the words below read as sounds instead of shapes —
          but nothing is locked. Every word comes with audio.
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Dismiss recommendation"
        className="h-8 w-8 shrink-0 p-0 text-muted-foreground"
        onClick={dismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
