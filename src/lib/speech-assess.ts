"use client";

/**
 * Browser-side Azure Pronunciation Assessment for Thai (th-TH), scripted
 * mode: the learner's recording is scored against the known reference
 * text. Auth comes from /api/speech-token (short-lived token; the key
 * stays on the server, the audio stays in the browser).
 *
 * What Azure can and can't do here (verified 2026-07-06): th-TH gives
 * accuracy (phoneme/word/full-text), fluency, completeness, and the
 * composite PronScore. Prosody — the intonation score — is en-US only,
 * so there is NO tone score for Thai from Azure; tone feedback is our
 * own pitch trace (src/lib/pitch.ts). Cost: billed as standard STT
 * (~$1/audio-hour, prorated per second; F0 free tier = 5 h/month).
 */

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { toPcm16Mono16k } from "@/lib/pitch";

export interface WordScore {
  word: string;
  /** 0–100 accuracy; how close the segments were to a native speaker. */
  accuracy: number;
  /** None | Mispronunciation | Omission | Insertion */
  errorType: string;
}

export interface AssessmentResult {
  /** Composite 0–100 score (accuracy + fluency + completeness). */
  pronScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  words: WordScore[];
  /** What the recognizer heard, for the "it heard something else" case. */
  recognized: string;
}

/** Azure tokens live ~10 min; refresh with margin. */
const TOKEN_TTL_MS = 8 * 60 * 1000;
let cachedToken: { token: string; region: string; at: number } | null = null;

async function getToken(): Promise<{ token: string; region: string }> {
  if (cachedToken && Date.now() - cachedToken.at < TOKEN_TTL_MS) {
    return cachedToken;
  }
  const res = await fetch("/api/speech-token");
  if (!res.ok) {
    throw new Error(
      res.status === 503
        ? "Speech assessment isn't configured on this deployment."
        : "Couldn't reach the speech service. Try again in a moment.",
    );
  }
  const { token, region } = (await res.json()) as {
    token: string;
    region: string;
  };
  cachedToken = { token, region, at: Date.now() };
  return cachedToken;
}

/** Shape of the per-word detail in the recognizer's JSON result. */
interface DetailWord {
  Word: string;
  PronunciationAssessment?: { AccuracyScore?: number; ErrorType?: string };
}

/**
 * Score a recording (already decoded to an AudioBuffer) against the
 * reference text. Throws with a learner-readable message when nothing
 * intelligible was captured.
 */
export async function assessPronunciation(
  buffer: AudioBuffer,
  referenceText: string,
): Promise<AssessmentResult> {
  const { token, region } = await getToken();
  const pcm = await toPcm16Mono16k(buffer);

  const format = sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);
  const push = sdk.AudioInputStream.createPushStream(format);
  push.write(pcm.buffer as ArrayBuffer);
  push.close();

  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
  speechConfig.speechRecognitionLanguage = "th-TH";
  const paConfig = new sdk.PronunciationAssessmentConfig(
    referenceText,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Phoneme,
    false, // no miscue: short prompts, omissions already tank completeness
  );

  const recognizer = new sdk.SpeechRecognizer(
    speechConfig,
    sdk.AudioConfig.fromStreamInput(push),
  );
  paConfig.applyTo(recognizer);

  try {
    const result = await new Promise<sdk.SpeechRecognitionResult>(
      (resolve, reject) =>
        recognizer.recognizeOnceAsync(resolve, (err) =>
          reject(new Error(String(err))),
        ),
    );

    if (result.reason !== sdk.ResultReason.RecognizedSpeech) {
      throw new Error(
        "Couldn't hear a clear attempt — get closer to the mic and try again.",
      );
    }

    const pa = sdk.PronunciationAssessmentResult.fromResult(result);
    const detail = JSON.parse(
      result.properties.getProperty(
        sdk.PropertyId.SpeechServiceResponse_JsonResult,
      ),
    ) as { NBest?: { Words?: DetailWord[] }[] };

    return {
      pronScore: pa.pronunciationScore,
      accuracy: pa.accuracyScore,
      fluency: pa.fluencyScore,
      completeness: pa.completenessScore,
      recognized: result.text,
      words: (detail.NBest?.[0]?.Words ?? []).map((w) => ({
        word: w.Word,
        accuracy: w.PronunciationAssessment?.AccuracyScore ?? 0,
        errorType: w.PronunciationAssessment?.ErrorType ?? "None",
      })),
    };
  } finally {
    recognizer.close();
  }
}
