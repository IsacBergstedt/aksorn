"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { playAudioKey } from "@/lib/audio";
import type { MatchItem } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

function shuffled<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Left-column Thai for an item: glyph for characters, the word for words. */
function itemThai(item: MatchItem): string {
  return item.kind === "word" ? item.thai : item.glyph;
}

/** Right-column label: names for characters, meanings for words. */
function itemLabel(item: MatchItem): string {
  return item.kind === "word" ? item.meaning : item.nameRtgs;
}

function itemSpokenText(item: MatchItem): string {
  return item.kind === "word" ? item.thai : item.nameThai;
}

/**
 * Match Thai to its counterpart: characters pair glyph ↔ name, vocab
 * words pair Thai ↔ meaning (mixes of both work fine in one grid).
 */
export function MatchPairs({
  items,
  onComplete,
}: {
  items: MatchItem[];
  onComplete: OnExerciseComplete;
}) {
  const thaiColumn = useMemo(() => shuffled(items), [items]);
  const labelColumn = useMemo(() => shuffled(items), [items]);

  const [selectedThai, setSelectedThai] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [flashWrong, setFlashWrong] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (selectedThai === null || selectedLabel === null) return;
    if (selectedThai === selectedLabel) {
      const match = items.find((c) => c.id === selectedThai);
      if (match) playAudioKey(match.audioKey, itemSpokenText(match));
      setMatched((prev) => new Set(prev).add(selectedThai));
      setSelectedThai(null);
      setSelectedLabel(null);
    } else {
      setFlashWrong(true);
      setMissed((prev) => new Set(prev).add(selectedThai));
      const timer = setTimeout(() => {
        setFlashWrong(false);
        setSelectedThai(null);
        setSelectedLabel(null);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [selectedThai, selectedLabel, items]);

  useEffect(() => {
    if (matched.size === items.length && !completedRef.current) {
      completedRef.current = true;
      const timer = setTimeout(() => {
        onComplete(
          items.map((c) => ({
            characterId: c.id,
            correct: !missed.has(c.id),
          })),
        );
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [matched, items, missed, onComplete]);

  const tileClass = (id: string, column: "thai" | "label") => {
    const isSelected =
      column === "thai" ? selectedThai === id : selectedLabel === id;
    return cn(
      "relative flex min-h-20 w-full items-center justify-center rounded-2xl border-2 bg-card p-3 shadow-sm transition-colors",
      matched.has(id)
        ? "border-emerald-400 bg-emerald-50 opacity-60"
        : isSelected
          ? flashWrong
            ? "border-destructive bg-red-50"
            : "border-primary bg-secondary"
          : "border-border hover:border-primary/50",
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center text-lg font-semibold text-muted-foreground">
        Match the pairs
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {thaiColumn.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={matched.has(c.id)}
              onClick={() =>
                setSelectedThai((prev) => (prev === c.id ? null : c.id))
              }
              className={tileClass(c.id, "thai")}
            >
              <span
                className={cn(
                  "font-thai leading-snug",
                  c.kind === "word" ? "text-2xl" : "text-4xl leading-none",
                )}
              >
                {itemThai(c)}
              </span>
              {matched.has(c.id) && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-emerald-600" />
              )}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {labelColumn.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={matched.has(c.id)}
              onClick={() =>
                setSelectedLabel((prev) => (prev === c.id ? null : c.id))
              }
              className={tileClass(c.id, "label")}
            >
              <span
                className={cn(
                  "font-semibold",
                  c.kind === "word" ? "text-base" : "text-lg",
                )}
              >
                {itemLabel(c)}
              </span>
              {matched.has(c.id) && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-emerald-600" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
