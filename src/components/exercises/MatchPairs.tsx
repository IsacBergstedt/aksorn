"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThaiCharacter } from "@/content/schema";
import type { OnExerciseComplete } from "./types";

function shuffled<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function MatchPairs({
  characters,
  onComplete,
}: {
  characters: ThaiCharacter[];
  onComplete: OnExerciseComplete;
}) {
  const glyphColumn = useMemo(() => shuffled(characters), [characters]);
  const nameColumn = useMemo(() => shuffled(characters), [characters]);

  const [selectedGlyph, setSelectedGlyph] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [flashWrong, setFlashWrong] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (selectedGlyph === null || selectedName === null) return;
    if (selectedGlyph === selectedName) {
      setMatched((prev) => new Set(prev).add(selectedGlyph));
      setSelectedGlyph(null);
      setSelectedName(null);
    } else {
      setFlashWrong(true);
      setMissed((prev) => new Set(prev).add(selectedGlyph));
      const timer = setTimeout(() => {
        setFlashWrong(false);
        setSelectedGlyph(null);
        setSelectedName(null);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [selectedGlyph, selectedName]);

  useEffect(() => {
    if (matched.size === characters.length && !completedRef.current) {
      completedRef.current = true;
      const timer = setTimeout(() => {
        onComplete(
          characters.map((c) => ({
            characterId: c.id,
            correct: !missed.has(c.id),
          })),
        );
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [matched, characters, missed, onComplete]);

  const tileClass = (id: string, column: "glyph" | "name") => {
    const isSelected =
      column === "glyph" ? selectedGlyph === id : selectedName === id;
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
        Match each character to its name
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {glyphColumn.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={matched.has(c.id)}
              onClick={() =>
                setSelectedGlyph((prev) => (prev === c.id ? null : c.id))
              }
              className={tileClass(c.id, "glyph")}
            >
              <span className="font-thai text-4xl leading-none">{c.glyph}</span>
              {matched.has(c.id) && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-emerald-600" />
              )}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {nameColumn.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={matched.has(c.id)}
              onClick={() =>
                setSelectedName((prev) => (prev === c.id ? null : c.id))
              }
              className={tileClass(c.id, "name")}
            >
              <span className="text-lg font-semibold">{c.nameRtgs}</span>
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
