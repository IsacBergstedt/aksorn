"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays, Check, CircleHelp, Clock3, Hand, HandHelping, Hash,
  Heart, History, House, IdCard, ListChecks, Lock, Map, MessageCircle,
  MessagesSquare, Route, ShoppingBag, Star, ThumbsUp, Trophy, Utensils,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { lessonById, phrasesUnits } from "@/content";
import type { Lesson, Unit } from "@/content/schema";
import { useProgressStore } from "@/lib/progress/store";
import { useMounted } from "@/lib/use-mounted";
import { COURSE_FREE_ACCESS } from "@/lib/course-access";
import { cn } from "@/lib/utils";

type NodeState = "completed" | "current" | "available" | "locked";

// Topic colors stay distinct from the five spoken-tone colors used in exercises.
const UNIT_THEMES = {
  indigo: {
    card: "border-t-indigo-400 bg-gradient-to-br from-indigo-50 to-card dark:from-indigo-950/50",
    icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200",
    label: "text-indigo-700 dark:text-indigo-300",
    progress: "[&_[data-slot=progress-indicator]]:bg-indigo-500",
  },
  amber: {
    card: "border-t-amber-400 bg-gradient-to-br from-amber-50 to-card dark:from-amber-950/40",
    icon: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    label: "text-amber-800 dark:text-amber-300",
    progress: "[&_[data-slot=progress-indicator]]:bg-amber-500",
  },
  teal: {
    card: "border-t-teal-400 bg-gradient-to-br from-teal-50 to-card dark:from-teal-950/40",
    icon: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
    label: "text-teal-800 dark:text-teal-300",
    progress: "[&_[data-slot=progress-indicator]]:bg-teal-500",
  },
  rose: {
    card: "border-t-rose-400 bg-gradient-to-br from-rose-50 to-card dark:from-rose-950/40",
    icon: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
    label: "text-rose-800 dark:text-rose-300",
    progress: "[&_[data-slot=progress-indicator]]:bg-rose-500",
  },
};

const UNIT_TOPICS: Record<string, { icon: LucideIcon; theme: keyof typeof UNIT_THEMES }> = {
  "words-greetings": { icon: Hand, theme: "amber" },
  "words-responses": { icon: ThumbsUp, theme: "teal" },
  "words-introductions": { icon: IdCard, theme: "indigo" },
  "words-numbers": { icon: Hash, theme: "amber" },
  "words-food": { icon: Utensils, theme: "rose" },
  "words-shopping": { icon: ShoppingBag, theme: "amber" },
  "words-getting-around": { icon: Map, theme: "teal" },
  "words-time": { icon: Clock3, theme: "indigo" },
  "words-feelings": { icon: Heart, theme: "rose" },
  "words-questions": { icon: CircleHelp, theme: "teal" },
  "words-first-sentences": { icon: MessageCircle, theme: "indigo" },
  "words-afternoon-out": { icon: ListChecks, theme: "amber" },
  "words-short-conversations": { icon: MessagesSquare, theme: "teal" },
  "words-wants-requests": { icon: HandHelping, theme: "rose" },
  "words-everyday-life": { icon: House, theme: "amber" },
  "words-plans-invitations": { icon: CalendarDays, theme: "indigo" },
  "words-past-experiences": { icon: History, theme: "teal" },
  "words-reasons-preferences": { icon: Route, theme: "rose" },
};

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
  const isCheckpoint = lesson.kind === "checkpoint";
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
          state === "available" && "border-primary/40 bg-primary/10 text-primary",
          state === "locked" && "border-border bg-secondary text-muted-foreground",
          // Checkpoints read as the unit's gate: gold ring, trophy glyph.
          isCheckpoint && "ring-4 ring-amber-300/60",
        )}
      >
        {isCheckpoint ? (
          <Trophy className="h-7 w-7" />
        ) : state === "completed" ? (
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
      <p className="text-xs text-muted-foreground">
        {lesson.xpReward} XP
        {isCheckpoint && lesson.passThreshold !== undefined && (
          <> · pass {Math.round(lesson.passThreshold * 100)}%</>
        )}
      </p>
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
}: {
  unit: Unit;
  unlocked: boolean;
  completedCount: number;
  lessonCount: number;
}) {
  const topic = UNIT_TOPICS[unit.id] ?? { icon: MessageCircle, theme: "indigo" };
  const Icon = topic.icon;
  const theme = UNIT_THEMES[topic.theme];

  return (
    <Card
      className={cn(
        "w-full overflow-hidden border-t-4",
        theme.card,
        unlocked && "shadow-sm",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14", theme.icon)}>
            <Icon aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <p className={cn("text-xs font-bold uppercase tracking-widest", theme.label)}>
                Unit {unit.order}
              </p>
              {unit.comingSoon ? (
                <Badge variant="secondary" className="bg-card/80">Coming soon</Badge>
              ) : (
                !unlocked && <Lock aria-label="Locked unit" className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-lg font-bold">{unit.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {unit.description}
            </p>
          </div>
        </div>
        {lessonCount > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <Progress
              aria-label={`${unit.title} progress`}
              value={(completedCount / lessonCount) * 100}
              className={cn("flex-1 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-foreground/5", theme.progress)}
            />
            <span className="whitespace-nowrap rounded-full bg-card/80 px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
              {completedCount}/{lessonCount} lessons
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * The Thai Phrases course path: a winding vertical chain of lesson nodes
 * grouped under unit banners. The course is open from lesson one — doing
 * Reading Thai first is recommended (see ReadingFirstTip), never required.
 * Available lessons are temporarily open through COURSE_FREE_ACCESS;
 * unfinished units still show Coming soon with their learning goals.
 */
export function PhrasesPathMap() {
  const mounted = useMounted();
  const completions = useProgressStore((s) => s.completions);

  const isComplete = (lessonId: string) => mounted && !!completions[lessonId];

  const unitLessons = (unit: Unit): Lesson[] =>
    unit.lessonIds
      .map((id) => lessonById.get(id))
      .filter((l): l is Lesson => l !== undefined);

  const unitComplete = (unit: Unit) => {
    const lessons = unitLessons(unit);
    return lessons.length > 0 && lessons.every((l) => isComplete(l.id));
  };

  // Sequential unlocking: unit 1 is always open, unit N needs unit N-1
  // complete (stubs can't complete, so everything after the first stub
  // stays locked).
  const unlockedFlags = phrasesUnits.map((unit, i): boolean =>
    COURSE_FREE_ACCESS || i === 0 || unitComplete(phrasesUnits[i - 1]),
  );

  const allLessons = phrasesUnits.flatMap(unitLessons);
  const firstIncompleteId = allLessons.find((l) => !isComplete(l.id))?.id;

  let nodeIndex = 0; // continuous winding across units

  return (
    <div className="flex flex-col items-center gap-8">
      {phrasesUnits.map((unit, unitIdx) => {
        const lessons = unitLessons(unit);
        const unlocked = unlockedFlags[unitIdx];
        const completedCount = lessons.filter((l) => isComplete(l.id)).length;

        return (
          <section key={unit.id} className="flex w-full flex-col items-center gap-6">
            {unitIdx === 0 && (
              <header className="flex w-full items-center gap-3 pb-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Step 1 · Words &amp; Phrases
                </h2>
                <div aria-hidden className="h-px flex-1 bg-border" />
              </header>
            )}
            {unit.id === "words-first-sentences" && (
              <header className="mb-3 mt-8 w-full border-t border-primary/20 pt-8">
                <div className="rounded-r-2xl border-l-4 border-amber-400 bg-primary/5 px-5 py-7 sm:px-7 sm:py-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                    Step 2
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                    Sentences &amp; Conversations
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    You know the words. Now put them together.
                  </p>
                </div>
              </header>
            )}
            <UnitBanner
              unit={unit}
              unlocked={unlocked}
              completedCount={completedCount}
              lessonCount={lessons.length}
            />

            {lessons.length > 0 ? (
              <div className="flex flex-col items-center gap-7 py-2">
                {lessons.map((lesson) => {
                  const offset = WINDING_OFFSETS[nodeIndex++ % WINDING_OFFSETS.length];
                  const state: NodeState = isComplete(lesson.id)
                    ? "completed"
                    : unlocked && lesson.id === firstIncompleteId
                      ? "current"
                      : COURSE_FREE_ACCESS ? "available" : "locked";
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
