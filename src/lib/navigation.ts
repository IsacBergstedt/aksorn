import { BookOpen, Layers, Mic, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { coreUnitById, lessonById, phrasesUnitById } from "@/content";

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
function isPhrasesLessonPath(pathname: string): boolean {
  if (!pathname.startsWith("/lesson/")) return false;
  const lesson = lessonById.get(pathname.slice("/lesson/".length));
  return !!lesson && phrasesUnitById.has(lesson.unitId);
}

function isCoreLessonPath(pathname: string): boolean {
  if (!pathname.startsWith("/lesson/")) return false;
  const lesson = lessonById.get(pathname.slice("/lesson/".length));
  return !!lesson && coreUnitById.has(lesson.unitId);
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
      (pathname.startsWith("/lesson") && !isPhrasesLessonPath(pathname) && !isCoreLessonPath(pathname)) ||
      pathname === "/review",
  },
  {
    href: "/phrases",
    label: "Thai Phrases",
    shortLabel: "Phrases",
    icon: Route,
    isActive: (pathname) =>
      pathname === "/phrases" || isPhrasesLessonPath(pathname),
  },
  {
    href: "/core",
    label: "Core 1,000",
    shortLabel: "Core 1,000",
    icon: Layers,
    isActive: (pathname) => pathname === "/core" || pathname.startsWith("/core/") || isCoreLessonPath(pathname),
  },
  {
    href: "/speaking",
    label: "Practice Speaking",
    shortLabel: "Speaking",
    icon: Mic,
    isActive: (pathname) => pathname === "/speaking",
  },
];
