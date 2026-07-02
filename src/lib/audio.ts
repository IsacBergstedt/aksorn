"use client";

import { useCallback } from "react";
import type { ThaiCharacter } from "@/content/schema";

/**
 * Placeholder character audio (Phase 2 replaces this with real recordings).
 * Tries a static file at /audio/{audioKey}.mp3 first so recordings can be
 * dropped in without code changes, then falls back to the Web Speech API.
 */
export function useCharacterAudio(character: ThaiCharacter | null | undefined) {
  const play = useCallback(() => {
    if (!character || typeof window === "undefined") return;

    const audio = new Audio(`/audio/${character.audioKey}.mp3`);
    audio.play().catch(() => {
      if (!("speechSynthesis" in window)) return;
      const utterance = new SpeechSynthesisUtterance(character.nameThai);
      utterance.lang = "th-TH";
      utterance.rate = 0.8;
      const thaiVoice = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang.toLowerCase().startsWith("th"));
      if (thaiVoice) utterance.voice = thaiVoice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }, [character]);

  return { play };
}
