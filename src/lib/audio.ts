"use client";

import { useCallback } from "react";
import type { ThaiCharacter } from "@/content/schema";

/**
 * Pre-generated TTS clips (scripts/generate-audio.ts) live in the public
 * Supabase Storage bucket `audio` under {audioKey}.mp3. Without Supabase
 * env (pure guest/dev setup) we fall back to local /public/audio, so
 * recordings can still be dropped in by hand.
 */
function audioUrl(audioKey: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base
    ? `${base}/storage/v1/object/public/audio/${audioKey}.mp3`
    : `/audio/${audioKey}.mp3`;
}

function speakFallback(text: string | undefined): void {
  if (!text || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";
  utterance.rate = 0.8;
  const thaiVoice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith("th"));
  if (thaiVoice) utterance.voice = thaiVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/**
 * Imperative play, usable outside hooks (e.g. match/sort feedback where the
 * character varies per tap). Missing file or blocked autoplay rejects the
 * play() promise, which routes to the Web Speech fallback.
 */
export function playAudioKey(
  audioKey: string | null | undefined,
  fallbackText?: string,
): void {
  if (!audioKey || typeof window === "undefined") return;
  const audio = new Audio(audioUrl(audioKey));
  audio.play().catch(() => speakFallback(fallbackText));
}

/** Hook form for a fixed key (syllable prompts, concept examples). */
export function useAudio(
  audioKey: string | null | undefined,
  fallbackText?: string,
) {
  const play = useCallback(
    () => playAudioKey(audioKey, fallbackText),
    [audioKey, fallbackText],
  );
  return { play };
}

/** Character audio: the clip speaks the character's Thai name. */
export function useCharacterAudio(character: ThaiCharacter | null | undefined) {
  return useAudio(character?.audioKey, character?.nameThai);
}
