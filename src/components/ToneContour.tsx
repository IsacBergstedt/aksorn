"use client";

import { motion } from "framer-motion";
import type { Tone } from "@/content/schema";
import { toneContourPath, toneHex, toneLabel } from "@/lib/tone-colors";
import { cn } from "@/lib/utils";

/**
 * Small pitch-contour glyph for a tone, stroked in the tone's color.
 * Bump `playTrigger` (e.g. increment on every audio play) to re-run the
 * draw-along animation in time with the clip; leave it 0 for a static
 * contour.
 */
export function ToneContour({
  tone,
  playTrigger = 0,
  className,
}: {
  tone: Tone;
  playTrigger?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 48"
      className={cn("h-4 w-9", className)}
      role="img"
      aria-label={`${toneLabel[tone]} tone contour`}
    >
      {/* Static track so the shape is always visible between plays. */}
      <path
        d={toneContourPath[tone]}
        fill="none"
        stroke={toneHex[tone]}
        strokeOpacity={0.25}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <motion.path
        key={playTrigger}
        d={toneContourPath[tone]}
        fill="none"
        stroke={toneHex[tone]}
        strokeWidth={7}
        strokeLinecap="round"
        initial={{ pathLength: playTrigger > 0 ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
    </svg>
  );
}
