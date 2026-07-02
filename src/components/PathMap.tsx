"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenCheck, Check, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { lessonById, orderedLessons, units } from "@/content";
import { dueCards } from "@/lib/srs";
import { useProgressStore } from "@/lib/progress/store";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

/**
 * Home-screen lesson path: units in order, each with its lessons as nodes.
 * A lesson unlocks when the previous lesson in the overall path is complete.
 */
export function PathMap() {
  const mounted = useMounted();
  const completions = useProgressStore((s) => s.completions);
  const srsCards = useProgressStore((s) => s.srsCards);

  const due = mounted ? dueCards(srsCards) : [];
  const firstIncompleteIndex = orderedLessons.findIndex(
    (l) => !completions[l.id],
  );

  const lessonState = (lessonId: string): "completed" | "current" | "locked" => {
    if (!mounted) return "locked";
    if (completions[lessonId]) return "completed";
    const pathIndex = orderedLessons.findIndex((l) => l.id === lessonId);
    return pathIndex === firstIncompleteIndex ? "current" : "locked";
  };

  return (
    <div className="flex flex-col gap-6">
      {mounted && due.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <BookOpenCheck className="h-8 w-8 text-amber-500" />
              <div>
                <p className="font-semibold">Review time</p>
                <p className="text-sm text-muted-foreground">
                  {due.length} character{due.length === 1 ? "" : "s"} due for
                  review
                </p>
              </div>
            </div>
            <Button render={<Link href="/review" />}>Review</Button>
          </CardContent>
        </Card>
      )}

      {units.map((unit) => {
        const unitLessons = unit.lessonIds
          .map((id) => lessonById.get(id))
          .filter((l) => l !== undefined);
        const completedCount = unitLessons.filter(
          (l) => mounted && completions[l.id],
        ).length;

        return (
          <Card
            key={unit.id}
            className={cn(unit.comingSoon && "opacity-60")}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{unit.title}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {unit.description}
                  </p>
                </div>
                {unit.comingSoon && <Badge variant="secondary">Coming soon</Badge>}
              </div>

              {unitLessons.length > 0 && (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress
                      value={(completedCount / unitLessons.length) * 100}
                      className="h-2"
                    />
                    <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                      {completedCount}/{unitLessons.length}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col">
                    {unitLessons.map((lesson, i) => {
                      const state = lessonState(lesson.id);
                      const node = (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            {i > 0 && (
                              <div className="h-4 w-0.5 bg-border" aria-hidden />
                            )}
                            <motion.div
                              animate={
                                state === "current"
                                  ? { scale: [1, 1.06, 1] }
                                  : undefined
                              }
                              transition={{ repeat: Infinity, duration: 1.8 }}
                              className={cn(
                                "flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold shadow-sm",
                                state === "completed" &&
                                  "border-amber-400 bg-amber-100 text-amber-600",
                                state === "current" &&
                                  "border-primary bg-primary text-primary-foreground",
                                state === "locked" &&
                                  "border-border bg-secondary text-muted-foreground",
                              )}
                            >
                              {state === "completed" ? (
                                <Check className="h-6 w-6" />
                              ) : state === "locked" ? (
                                <Lock className="h-5 w-5" />
                              ) : (
                                lesson.order
                              )}
                            </motion.div>
                          </div>
                          <div className={cn(i > 0 && "pt-4")}>
                            <p
                              className={cn(
                                "font-semibold",
                                state === "locked" && "text-muted-foreground",
                              )}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.xpReward} XP
                              {state === "completed" &&
                                ` · best ${Math.round((completions[lesson.id]?.bestScore ?? 0) * 100)}%`}
                            </p>
                          </div>
                        </div>
                      );

                      return state === "locked" ? (
                        <div key={lesson.id} aria-disabled className="cursor-not-allowed">
                          {node}
                        </div>
                      ) : (
                        <Link
                          key={lesson.id}
                          href={`/lesson/${lesson.id}`}
                          className="rounded-xl transition-colors hover:bg-secondary/60"
                        >
                          {node}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
