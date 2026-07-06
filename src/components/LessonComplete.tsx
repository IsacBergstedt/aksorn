"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const item = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function LessonComplete({
  title,
  xpEarned,
  accuracy,
  streak,
  checkpoint = false,
  failed = false,
  passThreshold,
  onRetry,
  exitHref = "/",
}: {
  title: string;
  xpEarned: number;
  accuracy: number;
  streak: number;
  /** Renders the trophy/pass framing for checkpoint lessons. */
  checkpoint?: boolean;
  /** Checkpoint attempt below the pass threshold — retry, don't celebrate. */
  failed?: boolean;
  passThreshold?: number;
  onRetry?: () => void;
  exitHref?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-8 px-4 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={
          failed
            ? "flex h-20 w-20 items-center justify-center rounded-full bg-rose-100"
            : "flex h-20 w-20 items-center justify-center rounded-full bg-amber-100"
        }
      >
        {failed ? (
          <Target className="h-10 w-10 text-rose-500" />
        ) : checkpoint ? (
          <Trophy className="h-10 w-10 text-amber-500" />
        ) : (
          <Sparkles className="h-10 w-10 text-amber-500" />
        )}
      </motion.div>

      <div>
        <h1 className="text-3xl font-bold">
          {failed
            ? "Not quite there yet"
            : checkpoint
              ? "Checkpoint passed!"
              : "Lesson complete!"}
        </h1>
        <p className="mt-1 text-muted-foreground">{title}</p>
        {failed && passThreshold !== undefined && (
          <p className="mt-2 text-sm text-muted-foreground">
            You need {Math.round(passThreshold * 100)}% to pass — your
            practice still counted. Take another run at it.
          </p>
        )}
      </div>

      <motion.div
        className="grid w-full grid-cols-3 gap-3"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
      >
        <motion.div variants={item}>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <p className="text-xl font-bold text-amber-700">+{xpEarned}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700/70">
                XP
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card
            className={
              failed
                ? "border-rose-200 bg-rose-50"
                : "border-emerald-200 bg-emerald-50"
            }
          >
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <Target
                className={
                  failed ? "h-5 w-5 text-rose-500" : "h-5 w-5 text-emerald-600"
                }
              />
              <p
                className={
                  failed
                    ? "text-xl font-bold text-rose-600"
                    : "text-xl font-bold text-emerald-700"
                }
              >
                {Math.round(accuracy * 100)}%
              </p>
              <p
                className={
                  failed
                    ? "text-xs font-medium uppercase tracking-wide text-rose-600/70"
                    : "text-xs font-medium uppercase tracking-wide text-emerald-700/70"
                }
              >
                Accuracy
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <Zap className="h-5 w-5 text-indigo-600" />
              <p className="text-xl font-bold text-indigo-700">{streak}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-700/70">
                Day streak
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {failed && onRetry ? (
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button size="lg" onClick={onRetry}>
            <RotateCcw className="mr-2 h-4 w-4" /> Try again
          </Button>
          <Button size="lg" variant="outline" render={<Link href={exitHref} />}>
            Back to the path
          </Button>
        </div>
      ) : (
        <Button size="lg" className="w-full max-w-xs" render={<Link href={exitHref} />}>
          Continue
        </Button>
      )}
    </div>
  );
}
