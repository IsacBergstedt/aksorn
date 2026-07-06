/**
 * Client-side pitch (F0) tracking for the speaking practice tone trace.
 * Azure's pronunciation assessment scores segments but has no tone score
 * for Thai (prosody is en-US only), so the tone feedback is ours: extract
 * the pitch contour of the learner's recording and draw it against the
 * expected tone shape. Plain autocorrelation — small, dependency-free,
 * and plenty for voiced Thai syllables at speech pitch.
 */

/** One voiced frame: time in seconds, pitch in semitones vs. the median. */
export interface PitchPoint {
  t: number;
  semitones: number;
}

const FRAME_SEC = 0.04;
const HOP_SEC = 0.01;
const MIN_F0 = 70;
const MAX_F0 = 400;
/** Normalized autocorrelation peak below this = unvoiced, skip the frame. */
const MIN_CLARITY = 0.5;
/** RMS below this = silence, skip the frame. */
const MIN_RMS = 0.01;

/** Best F0 for one frame by normalized autocorrelation, or null if unvoiced. */
function frameF0(frame: Float32Array, sampleRate: number): number | null {
  let energy = 0;
  for (let i = 0; i < frame.length; i++) energy += frame[i] * frame[i];
  if (Math.sqrt(energy / frame.length) < MIN_RMS) return null;

  const minLag = Math.floor(sampleRate / MAX_F0);
  const maxLag = Math.min(Math.floor(sampleRate / MIN_F0), frame.length - 1);
  let bestLag = 0;
  let bestCorr = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    let norm = 0;
    for (let i = 0; i < frame.length - lag; i++) {
      corr += frame[i] * frame[i + lag];
      norm += frame[i + lag] * frame[i + lag];
    }
    const normalized = corr / Math.sqrt(energy * norm + 1e-9);
    if (normalized > bestCorr) {
      bestCorr = normalized;
      bestLag = lag;
    }
  }
  if (bestCorr < MIN_CLARITY || bestLag === 0) return null;
  return sampleRate / bestLag;
}

/**
 * Pitch contour of a recording, in semitones relative to the speaker's
 * median pitch — that normalization is what makes contours comparable
 * across voices (a falling tone falls the same way for any larynx).
 * Leading/trailing silence is trimmed by virtue of unvoiced frames
 * simply not appearing.
 */
export function trackPitch(buffer: AudioBuffer): PitchPoint[] {
  const data = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const frameLen = Math.floor(FRAME_SEC * sampleRate);
  const hop = Math.floor(HOP_SEC * sampleRate);

  const raw: { t: number; f0: number }[] = [];
  for (let start = 0; start + frameLen <= data.length; start += hop) {
    const f0 = frameF0(data.subarray(start, start + frameLen), sampleRate);
    if (f0 !== null) {
      raw.push({ t: (start + frameLen / 2) / sampleRate, f0 });
    }
  }
  if (raw.length === 0) return [];

  const sorted = raw.map((p) => p.f0).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return raw.map((p) => ({
    t: p.t,
    semitones: 12 * Math.log2(p.f0 / median),
  }));
}

/**
 * Downsample to 16 kHz mono PCM16 — the input format Azure's speech SDK
 * expects on a push stream.
 */
export async function toPcm16Mono16k(buffer: AudioBuffer): Promise<Int16Array> {
  const offline = new OfflineAudioContext(
    1,
    Math.ceil(buffer.duration * 16000),
    16000,
  );
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  const float = rendered.getChannelData(0);
  const pcm = new Int16Array(float.length);
  for (let i = 0; i < float.length; i++) {
    const s = Math.max(-1, Math.min(1, float[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm;
}
