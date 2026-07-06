"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { Tone } from "@/content/schema";
import type { PitchPoint } from "@/lib/pitch";
import type { AssessmentResult } from "@/lib/speech-assess";
import { ToneContour } from "@/components/ToneContour";
import { toneLabel } from "@/lib/tone-colors";
import { cn } from "@/lib/utils";

export type AssessStatus = "idle" | "assessing" | "scored" | "error";

/** Generic score coloring (matches exercise feedback, not the tone palette). */
function scoreClasses(score: number): string {
  if (score >= 80) return "border-emerald-300 bg-emerald-50 text-emerald-800";
  if (score >= 60) return "border-amber-300 bg-amber-50 text-amber-800";
  return "border-rose-300 bg-rose-50 text-rose-800";
}

function PitchCanvas({ pitch }: { pitch: PitchPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Midline = the speaker's median pitch (0 semitones by construction).
    ctx.strokeStyle = "rgba(100, 100, 110, 0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (pitch.length < 2) return;
    const t0 = pitch[0].t;
    const t1 = pitch[pitch.length - 1].t;
    const span = Math.max(t1 - t0, 0.2);
    const RANGE = 7; // ±7 semitones covers Thai tone excursions comfortably

    // Voiced frames can be discontinuous (stops, silence) — draw dots, not
    // a joined line, so gaps read as gaps.
    ctx.fillStyle = "#374151"; // charcoal-ink; tone colors stay tone-only
    for (const p of pitch) {
      const x = ((p.t - t0) / span) * (width - 8) + 4;
      const y =
        height / 2 - (Math.max(-RANGE, Math.min(RANGE, p.semitones)) / RANGE) * (height / 2 - 4);
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [pitch]);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={120}
      className="h-24 w-full rounded-xl border-2 border-border bg-secondary/30"
      aria-label="Pitch contour of your recording"
    />
  );
}

/**
 * Scores + tone trace for a speaking attempt. Azure supplies the segment
 * scores (accuracy/fluency per word); the pitch trace is computed locally
 * and is visual feedback only — deliberately unscored, since Azure has no
 * tone score for Thai and we won't pretend to one we haven't validated.
 */
export function PronunciationPanel({
  status,
  error,
  result,
  pitch,
  expectedTones,
}: {
  status: AssessStatus;
  error?: string;
  result: AssessmentResult | null;
  pitch: PitchPoint[] | null;
  /** The target's syllable tones (words only) — drawn as the expected shape. */
  expectedTones?: Tone[];
}) {
  if (status === "idle") return null;

  if (status === "assessing") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card p-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Scoring your
        pronunciation&hellip;
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        {error ?? "Something went wrong scoring that attempt."}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-center gap-3">
        <div
          className={cn(
            "flex h-16 w-16 flex-col items-center justify-center rounded-full border-2",
            scoreClasses(result.pronScore),
          )}
        >
          <span className="text-xl font-bold leading-none">
            {Math.round(result.pronScore)}
          </span>
          <span className="text-[10px] font-medium uppercase">score</span>
        </div>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Accuracy {Math.round(result.accuracy)}</span>
          <span>Fluency {Math.round(result.fluency)}</span>
          <span>Completeness {Math.round(result.completeness)}</span>
        </div>
      </div>

      {result.words.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {result.words.map((w, i) => (
            <span
              key={i}
              className={cn(
                "rounded-xl border px-3 py-1 font-thai text-lg",
                w.errorType === "Omission"
                  ? "border-rose-300 bg-rose-50 text-rose-800 line-through"
                  : scoreClasses(w.accuracy),
              )}
              title={`${Math.round(w.accuracy)} — ${w.errorType}`}
            >
              {w.word}
              <span className="ml-1.5 align-middle text-xs opacity-70">
                {Math.round(w.accuracy)}
              </span>
            </span>
          ))}
        </div>
      )}

      {pitch && pitch.length > 1 && (
        <div className="flex flex-col gap-2">
          <PitchCanvas pitch={pitch} />
          {expectedTones && expectedTones.length > 0 && (
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>Target shape:</span>
              {expectedTones.map((tone, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ToneContour tone={tone} className="h-5 w-11" />
                  {toneLabel[tone]}
                </span>
              ))}
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground">
            Your pitch trace (experimental) — compare its shape against the
            target tone{expectedTones && expectedTones.length > 1 ? "s" : ""},
            left to right. Not part of the score.
          </p>
        </div>
      )}
    </div>
  );
}
