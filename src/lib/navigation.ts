import { BookOpen, Mic, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { lessonById, wordsUnitById } from "@/content";

export type Section = {
  href: string;
  label: string;
  /** Compact label for the mobile tab bar. */
  shortLabel: string;
  icon: LucideIcon;
  /** True when the given pathname belongs to this section. */
  isActive: (pathname: string) => boolean;
};

/** Both courses share /lesson/*; the lesson's unit decides the section. */
function isWordsLessonPath(pathname: string): boolean {
  if (!pathname.startsWith("/lesson/")) return false;
  const lesson = lessonById.get(pathname.slice("/lesson/".length));
  return !!lesson && wordsUnitById.has(lesson.unitId);
}

/** Top-level learning sections, in display order. */
export const sections: Section[] = [
  {
    href: "/reading",
    label: "Reading Thai",
    shortLabel: "Reading",
    icon: BookOpen,
    // Script lessons and reviews are part of the script trainer.
    isActive: (pathname) =>
      pathname === "/reading" ||
      (pathname.startsWith("/lesson") && !isWordsLessonPath(pathname)) ||
      pathname === "/review",
  },
  {
    href: "/words",
    label: "Thai Words",
    shortLabel: "Words",
    icon: Route,
    isActive: (pathname) =>
      pathname === "/words" || isWordsLessonPath(pathname),
  },
  {
    href: "/speaking",
    label: "Practice Speaking",
    shortLabel: "Speaking",
    icon: Mic,
    isActive: (pathname) => pathname === "/speaking",
  },
];
