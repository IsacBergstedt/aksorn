"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Unit } from "@/content/schema";
import { cn } from "@/lib/utils";

type UnitPathState = "completed" | "current" | "locked";

// Alternating offsets give the path its winding shape. Tailwind needs the
// class names written out statically, so the cycle lives in an array.
const WINDING_OFFSETS = [
  "translate-x-0",
  "translate-x-10 md:translate-x-16",
  "translate-x-0",
  "-translate-x-10 md:-translate-x-16",
];

/**
 * Winding vertical unit path for the Thai Words course. Purely
 * presentational: state is derived from `completedUnitIds`, so once real
 * word lessons exist the same lesson engine and completion store plug in
 * without touching this component.
 */
export function LessonPath({
  units,
  completedUnitIds = [],
}: {
  units: Unit[];
  completedUnitIds?: string[];
}) {
  const completed = new Set(completedUnitIds);
  const firstIncompleteIndex = units.findIndex((u) => !completed.has(u.id));

  const stateFor = (unit: Unit, index: number): UnitPathState => {
    if (completed.has(unit.id)) return "completed";
    return index === firstIncompleteIndex ? "current" : "locked";
  };

  return (
    <div className="flex flex-col items-center">
      {units.map((unit, i) => {
        const state = stateFor(unit, i);
        return (
          <div key={unit.id} className="flex flex-col items-center">
            {i > 0 && (
              <div
                className="my-1 h-10 w-1 rounded-full bg-border"
                aria-hidden
              />
            )}
            <div
              className={cn(
                "flex flex-col items-center text-center",
                WINDING_OFFSETS[i % WINDING_OFFSETS.length],
              )}
            >
              <motion.div
                animate={
                  state === "current" ? { scale: [1, 1.06, 1] } : undefined
                }
                transition={{ repeat: Infinity, duration: 1.8 }}
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-sm",
                  state === "completed" &&
                    "border-amber-400 bg-amber-100 text-amber-600",
                  state === "current" &&
                    "border-primary bg-primary text-primary-foreground",
                  state === "locked" &&
                    "border-border bg-secondary text-muted-foreground",
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
              <div className="mt-3 max-w-56">
                <p
                  className={cn(
                    "font-semibold",
                    state === "locked" && "text-muted-foreground",
                  )}
                >
                  {unit.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {unit.description}
                </p>
                {unit.comingSoon && (
                  <Badge variant="secondary" className="mt-2">
                    Coming soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
