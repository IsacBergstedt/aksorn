"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Section navigation rendered from the shared config in `src/lib/navigation`.
 * `desktop` is the inline link row inside the header; `mobile` is a fixed
 * bottom tab bar (hidden during lessons to keep the exercise flow focused).
 */
export function SectionTabs({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav className="hidden items-center gap-1 md:flex">
        {sections.map((section) => {
          const active = section.isActive(pathname);
          return (
            <Link
              key={section.href}
              href={section.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  if (pathname.startsWith("/lesson")) return null;

  return (
    <>
      {/* In-flow spacer so page content can scroll clear of the fixed bar. */}
      <div className="h-16 md:hidden" aria-hidden />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md">
          {sections.map((section) => {
            const active = section.isActive(pathname);
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 pt-2 pb-2.5 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {section.shortLabel}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
