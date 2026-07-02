"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Target, Zap } from "lucide-react";
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
}: {
  title: string;
  xpEarned: number;
  accuracy: number;
  streak: number;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-8 px-4 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100"
      >
        <Sparkles className="h-10 w-10 text-amber-500" />
      </motion.div>

      <div>
        <h1 className="text-3xl font-bold">Lesson complete!</h1>
        <p className="mt-1 text-muted-foreground">{title}</p>
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
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <Target className="h-5 w-5 text-emerald-600" />
              <p className="text-xl font-bold text-emerald-700">
                {Math.round(accuracy * 100)}%
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/70">
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

      <Button
        size="lg"
        className="w-full max-w-xs"
        render={<Link href="/" />}
      >
        Continue
      </Button>
    </div>
  );
}
