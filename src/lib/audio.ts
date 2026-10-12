"use client";

import { useCallback } from "react";
import type { ThaiCharacter } from "@/content/schema";

let activeAudio: HTMLAudioElement | null = null;
let playbackVersion = 0;

/** Cancel playing and pending clips before switching between audio sources. */
export function stopAudio(): void {
  playbackVersion += 1;
  activeAudio?.pause();
  activeAudio = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function playAudioElement(
  audio: HTMLAudioElement,
  onError?: () => void,
): void {
  stopAudio();
  const version = playbackVersion;
  activeAudio = audio;
  audio.currentTime = 0;
  void audio.play().catch(() => {
    if (version !== playbackVersion) return;
    activeAudio = null;
    onError?.();
  });
}

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
  playAudioElement(audio, () => speakFallback(fallbackText));
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
