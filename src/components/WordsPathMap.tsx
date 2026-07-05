"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { lessonById, unitById, wordsUnits } from "@/content";
import type { Lesson, Unit } from "@/content/schema";
import { useProgressStore } from "@/lib/progress/store";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

type NodeState = "completed" | "current" | "locked";

// Alternating x-offsets give the path its winding shape. Tailwind needs
// static class names, so the cycle lives in an array.
const WINDING_OFFSETS = [
  "translate-x-0",
  "translate-x-12 md:translate-x-20",
  "translate-x-0",
  "-translate-x-12 md:-translate-x-20",
];

function LessonNode({
  lesson,
  state,
  offsetClass,
}: {
  lesson: Lesson;
  state: NodeState;
  offsetClass: string;
}) {
  const node = (
    <div className={cn("relative flex flex-col items-center", offsetClass)}>
      {state === "current" && (
        <span className="absolute -top-7 rounded-full border-2 border-primary bg-card px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
          Start
        </span>
      )}
      <motion.div
        animate={state === "current" ? { scale: [1, 1.06, 1] } : undefined}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-sm",
          state === "completed" && "border-amber-400 bg-amber-100 text-amber-600",
          state === "current" && "border-primary bg-primary text-primary-foreground",
          state === "locked" && "border-border bg-secondary text-muted-foreground",
        )}
      >
        {state === "completed" ? (
          <Check className="h-7 w-7" />
        ) : state === "locked" ? (
          <Lock className="h-6 w-6" />
        ) : (
          <Star className="h-7 w-7" />
        )}
      </motion.div>
      <p
        className={cn(
          "mt-2 max-w-36 text-center text-sm font-semibold leading-tight",
          state === "locked" && "text-muted-foreground",
        )}
      >
        {lesson.title}
      </p>
      <p className="text-xs text-muted-foreground">{lesson.xpReward} XP</p>
    </div>
  );

  return state === "locked" ? (
    <div aria-disabled className="cursor-not-allowed">
      {node}
    </div>
  ) : (
    <Link
      href={`/lesson/${lesson.id}`}
      className="rounded-2xl transition-transform hover:scale-[1.03]"
    >
      {node}
    </Link>
  );
}

function UnitBanner({
  unit,
  unlocked,
  completedCount,
  lessonCount,
  gateMessage,
}: {
  unit: Unit;
  unlocked: boolean;
  completedCount: number;
  lessonCount: number;
  gateMessage?: string;
}) {
  return (
    <Card
      className={cn(
        "w-full",
        unlocked ? "border-primary/30 bg-primary/5" : "opacity-80",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">{unit.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {unit.description}
            </p>
          </div>
          {unit.comingSoon ? (
            <Badge variant="secondary">Coming soon</Badge>
          ) : (
            !unlocked && <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </div>
        {gateMessage && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <span>{gateMessage}</span>
            <Button size="sm" variant="outline" render={<Link href="/reading" />}>
              Go to Reading Thai
            </Button>
          </div>
        )}
        {lessonCount > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <Progress value={(completedCount / lessonCount) * 100} className="h-2" />
            <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
              {completedCount}/{lessonCount}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * The Thai Words course path: a winding vertical chain of lesson nodes
 * grouped under unit banners. Units unlock sequentially; the first unit
 * additionally requires the Reading Thai mid-class unit (consonant classes
 * are what make the tone features teachable). Stub units render as locked
 * nodes with their learning goals.
 */
export function WordsPathMap() {
  const mounted = useMounted();
  const completions = useProgressStore((s) => s.completions);

  const isComplete = (lessonId: string) => mounted && !!completions[lessonId];

  // Gate: all mid-class lessons of the Reading Thai course.
  const midClassUnit = unitById.get("mid-class");
  const midClassDone =
    !!midClassUnit && midClassUnit.lessonIds.every(isComplete);

  const unitLessons = (unit: Unit): Lesson[] =>
    unit.lessonIds
      .map((id) => lessonById.get(id))
      .filter((l): l is Lesson => l !== undefined);

  const unitComplete = (unit: Unit) => {
    const lessons = unitLessons(unit);
    return lessons.length > 0 && lessons.every((l) => isComplete(l.id));
  };

  // Sequential unlocking: unit 1 needs the reading gate, unit N needs
  // unit N-1 complete (stubs can't complete, so everything after the
  // first stub stays locked).
  const unlockedFlags = wordsUnits.map((unit, i): boolean =>
    i === 0 ? midClassDone : unitComplete(wordsUnits[i - 1]),
  );

  const allLessons = wordsUnits.flatMap(unitLessons);
  const firstIncompleteId = allLessons.find((l) => !isComplete(l.id))?.id;

  let nodeIndex = 0; // continuous winding across units

  return (
    <div className="flex flex-col items-center gap-8">
      {wordsUnits.map((unit, unitIdx) => {
        const lessons = unitLessons(unit);
        const unlocked = unlockedFlags[unitIdx];
        const completedCount = lessons.filter((l) => isComplete(l.id)).length;

        return (
          <section key={unit.id} className="flex w-full flex-col items-center gap-6">
            <UnitBanner
              unit={unit}
              unlocked={unlocked}
              completedCount={completedCount}
              lessonCount={lessons.length}
              gateMessage={
                unitIdx === 0 && mounted && !midClassDone
                  ? "Finish the Mid-Class Consonants unit in Reading Thai to unlock this course."
                  : undefined
              }
            />

            {lessons.length > 0 ? (
              <div className="flex flex-col items-center gap-7 py-2">
                {lessons.map((lesson) => {
                  const offset = WINDING_OFFSETS[nodeIndex++ % WINDING_OFFSETS.length];
                  const state: NodeState = isComplete(lesson.id)
                    ? "completed"
                    : unlocked && lesson.id === firstIncompleteId
                      ? "current"
                      : "locked";
                  return (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson}
                      state={state}
                      offsetClass={offset}
                    />
                  );
                })}
              </div>
            ) : (
              <div
                className={cn(
                  "flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border p-6 text-center",
                  WINDING_OFFSETS[nodeIndex++ % WINDING_OFFSETS.length],
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-secondary text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                {unit.goals && (
                  <ul className="space-y-1 text-left text-sm text-muted-foreground">
                    {unit.goals.map((goal, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden className="text-primary">•</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
