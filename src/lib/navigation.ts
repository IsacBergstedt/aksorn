import { BookOpen, Mic, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Section = {
  href: string;
  label: string;
  /** Compact label for the mobile tab bar. */
  shortLabel: string;
  icon: LucideIcon;
  /** True when the given pathname belongs to this section. */
  isActive: (pathname: string) => boolean;
};

/** Top-level learning sections, in display order. */
export const sections: Section[] = [
  {
    href: "/reading",
    label: "Reading Thai",
    shortLabel: "Reading",
    icon: BookOpen,
    // Lessons and reviews are part of the script trainer.
    isActive: (pathname) =>
      pathname === "/reading" ||
      pathname.startsWith("/lesson") ||
      pathname === "/review",
  },
  {
    href: "/words",
    label: "Thai Words",
    shortLabel: "Words",
    icon: Route,
    isActive: (pathname) => pathname === "/words",
  },
  {
    href: "/speaking",
    label: "Practice Speaking",
    shortLabel: "Speaking",
    icon: Mic,
    isActive: (pathname) => pathname === "/speaking",
  },
];
